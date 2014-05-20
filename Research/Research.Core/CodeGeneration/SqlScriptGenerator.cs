
namespace Research.Core.CodeGeneration
{
    using Microsoft.SqlServer.Management.Common;
    using Microsoft.SqlServer.Management.Smo;
    using System;
    using System.Collections.Generic;
    using System.Collections.Specialized;
    using System.Data;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Research.Core.CodeGeneration.SqlScriptDtos;
    
    public class SqlScriptGenerator
    {
        /// <summary>
        /// Maps SMO objects to Dtos.
        /// </summary>
        public SqlScriptingInput GetSqlScriptingInput(string serverName, string databaseName, string userName = null, string password = null)
        {
            var result = new SqlScriptingInput();

            var server = GetServer(serverName, userName, password);

            try
            {
                server.ConnectionContext.Connect();
                Database database = server.Databases[databaseName];
                MapSmoTablesToSqlScriptDtos(database.Tables.Cast<Table>().Where(x => x.IsSystemObject == false), result);
                MapSmoTextObjectsToSqlScriptDtos(database.StoredProcedures.Cast<StoredProcedure>().Where(x => x.IsSystemObject == false), "procedure", "StoredProcedures", result);
                MapSmoTextObjectsToSqlScriptDtos(database.UserDefinedFunctions.Cast<UserDefinedFunction>().Where(x => x.IsSystemObject == false), "function", "Functions", result);
                MapSmoTextObjectsToSqlScriptDtos(database.Views.Cast<View>().Where(x => x.IsSystemObject == false), "view", "Views", result);
            }
            finally
            {
                server.ConnectionContext.Disconnect();
            }

            return result;
        }

        public void MapSmoTextObjectsToSqlScriptDtos(IEnumerable<object> textObjects, string typeName, string groupName, SqlScriptingInput input)
        {
            
            foreach (object textObject in textObjects)
            {
                ScriptSchemaObjectBase textObjectAsScriptSchemaObjectBase = (ScriptSchemaObjectBase)textObject;
                ITextObject textObjectAsTextObject = (ITextObject)textObject;

                var sqlTextObject = new SqlTextObject
                {
                    GroupName = groupName,
                    Name = textObjectAsScriptSchemaObjectBase.Name,
                    Schema = textObjectAsScriptSchemaObjectBase.Schema,
                    TextBody = textObjectAsTextObject.TextBody,
                    TextHeader = textObjectAsTextObject.TextHeader,
                    TypeName = typeName
                };

                input.TextObjects.Add(sqlTextObject);
            }
        }

        public void MapSmoTablesToSqlScriptDtos(IEnumerable<Table> tables, SqlScriptingInput input)
        {
            foreach (Table table in tables)
            {
                var sqlTable = new SqlTable
                {
                    Name = table.Name,
                    Schema = table.Schema
                };

                foreach (Column column in table.Columns)
                {
                    DataType dataType =  column.DataType;
                    var sqlColumn = new SqlColumn
                    {
                        DataTypeMaximumLength = dataType.MaximumLength,
                        DataTypeName = dataType.Name,
                        DataTypeNumericPrecision = dataType.NumericPrecision,
                        DataTypeNumericScale = dataType.NumericScale,
                        IdentityIncrement = column.IdentityIncrement,
                        IdentitySeed = column.IdentitySeed,
                        IsDefault = (column.DefaultConstraint != null),
                        IsForeignKey = (table.ForeignKeys != null && table.ForeignKeys.Count > 0),
                        IsIdentity = column.Identity,
                        IsNullable = column.Nullable,
                        IsPrimaryKey = (column.InPrimaryKey),
                        Name = column.Name
                    };

                    sqlTable.Columns.Add(sqlColumn);
                }

                foreach (ForeignKey fk in table.ForeignKeys)
                {
                    ForeignKeyColumn fkc = fk.Columns[0];
                    
                    // TODO: this is not a correct mapping, must be fixed!
                    var sqlForeignKey = new SqlForeignKey
                    {
                        ReferencedSchemaName = fk.ReferencedTableSchema,
                        ReferencedTableName = fk.ReferencedTable,
                        ColumnName = fkc.Name,
                        ReferencedColumnName = fkc.ReferencedColumn
                    };
                    
                    sqlTable.ForeignKeys.Add(sqlForeignKey);
                }

                input.Tables.Add(sqlTable);
            }
        }
        
        public SqlScriptingResult GenerateSqlScripts(SqlScriptingInput input)
        {
            var result = new SqlScriptingResult();

            HandleTables(result, input.Tables);
            HandleTextObjects(result, input.TextObjects);

            return result;
        }


        public Server GetServer(string serverName, string userName, string password)
        {
            var connectionInfo = new SqlConnectionInfo();
            connectionInfo.ServerName = serverName;
            if (string.IsNullOrWhiteSpace(userName))
            {
                // Use Windows authentication.
                connectionInfo.UseIntegratedSecurity = true;
            }
            else
            {
                // Use SQL authentication.
                connectionInfo.UseIntegratedSecurity = false;
                connectionInfo.UserName = userName;
                connectionInfo.Password = password;
            }

            var connection = new ServerConnection(connectionInfo);
            var server = new Server(connection);
            return server;
        }

        public void HandleTextObjects(SqlScriptingResult result, List<SqlTextObject> textObjects)
        {
            foreach (SqlTextObject textObject in textObjects)
            {
                var contentBuilder = new StringBuilder(string.Empty);
                string name = string.Format("{0}.{1}", textObject.Schema, textObject.Name);

                AddTextObjectHeader(contentBuilder, name, textObject.TypeName);
                contentBuilder.Append(textObject.TextHeader);
                contentBuilder.Append(textObject.TextBody);
                AddTextObjectFooter(contentBuilder);

                AddScriptToResult(textObject.GroupName, textObject.Schema, textObject.Name, contentBuilder, result);
            }
        }

        public void HandleTables(SqlScriptingResult result, List<SqlTable> tables)
        {
            foreach (SqlTable table in tables)
            {
                var contentBuilder = new StringBuilder(string.Empty);
                string name = string.Format("{0}.{1}", table.Schema, table.Name);
                
                AddTableHeader(contentBuilder, name, "table");
                int totalColumnCount = table.Columns.Count;
                for (int i = 0; i < totalColumnCount; i++)
                {
                    SqlColumn column = table.Columns[i];
                    var columnBuilder = new StringBuilder(string.Empty);
                    columnBuilder.AppendFormat("        {0}", column.Name);
                    columnBuilder.AppendFormat(" {0}", column.DataTypeName);
                    HandleDataTypeLength(column, columnBuilder);
                    HandleIdentity(column, columnBuilder);
                    HandleNullability(column, columnBuilder);
                    HandlePrimaryKey(table, column, columnBuilder);
                    HandleDefault(table, column, columnBuilder);
                    HandleForeignKey(table, column, columnBuilder);
                    HandleSeperator(totalColumnCount, i, columnBuilder);
                    contentBuilder.AppendLine(columnBuilder.ToString());
                }
                AddTableFooter(contentBuilder);
                
                AddScriptToResult("Tables", table.Schema, table.Name, contentBuilder, result);
            }
        }

        public void AddTableHeader(StringBuilder contentBuilder, string name, string typeName)
        {
            contentBuilder.AppendFormat(@"
if object_id('{0}') is null
begin
    create {1} {0}
    (
", name, typeName);
        }

        public void AddTextObjectHeader(StringBuilder contentBuilder, string name, string typeName)
        {
            contentBuilder.AppendFormat(@"
if object_id('{0}') is null
begin
    drop {1} {0}
end
", name, typeName);
        }

        public void AddTextObjectFooter(StringBuilder contentBuilder)
        {
            contentBuilder.Append(@"go");
        }

        public void AddTableFooter(StringBuilder contentBuilder)
        {
            contentBuilder.Append(@"    )
end
go
");
        }

        public void AddScriptToResult(string folderName, string schema, string name , StringBuilder fileContent, SqlScriptingResult result)
        {
            var script = new SqlScriptInfo
            {
                FileContent = fileContent.ToString(),
                FileName = string.Format("{0}.{1}.sql", schema, name),
                FolderName = folderName
            };

            result.Scripts.Add(script);
        }

        public void HandleSeperator(int totalColumnCount, int i, StringBuilder columnBuilder)
        {
            // Don't add "," for last column.
            if (i < totalColumnCount - 1)
            {
                columnBuilder.Append(",");
            }
        }

        public void HandleForeignKey(SqlTable table, SqlColumn column, StringBuilder columnBuilder)
        {
            if (column.IsForeignKey)
            {
                foreach (SqlForeignKey fk in table.ForeignKeys)
                {
                    if (fk.ColumnName.Equals(column.Name))
                    {
                        // TODO: this will break, when column is part of multiple foreingkeys.
                        columnBuilder.AppendFormat(" constraint FK_{0}_{1}_{2} foreign key references {3}.{4}({5})", table.Schema, table.Name, column.Name, fk.ReferencedSchemaName, fk.ReferencedTableName, fk.ReferencedColumnName);
                        break;
                    }
                }
            }
        }

        public void HandleDefault(SqlTable table, SqlColumn column, StringBuilder columnBuilder)
        {
            if (column.IsDefault)
            {
                // TODO: this will break, when column is foreignkey and default.
                columnBuilder.AppendFormat(" constraint DF_{0}_{1}_{2} default {3}", table.Schema, table.Name, column.Name, column.DefaultText);
            }
        }

        public void HandlePrimaryKey(SqlTable table, SqlColumn column, StringBuilder columnBuilder)
        {
            if (column.IsPrimaryKey)
            {
                // TODO: this will break, when column is part of a composite primairy key.
                columnBuilder.AppendFormat(" constraint PK_{0}_{1}_{2} primary key", table.Schema, table.Name, column.Name);
            }
        }

        public void HandleIdentity(SqlColumn column, StringBuilder columnBuilder)
        {
            if (column.IsIdentity)
            {
                columnBuilder.AppendFormat(" identity({0},{1})", column.IdentitySeed, column.IdentityIncrement);
            }
        }

        public void HandleNullability(SqlColumn column, StringBuilder columnBuilder)
        {
            if (column.IsNullable)
            {
                columnBuilder.Append(" null");
            }
            else
            {
                columnBuilder.Append(" not null");
            }
        }

        public void HandleDataTypeLength(SqlColumn column, StringBuilder columnBuilder)
        {
            string dataTypeName = column.DataTypeName;
            if (dataTypeName.Equals("varchar") || dataTypeName.Equals("nvarchar") || dataTypeName.Equals("char") || dataTypeName.Equals("nchar") || dataTypeName.Equals("binary"))
            {
                if (column.DataTypeMaximumLength == -1)
                {
                    columnBuilder.Append("(max)");
                }
                else
                {
                    columnBuilder.AppendFormat("({0})", column.DataTypeMaximumLength);
                }
            }

            if (dataTypeName.Equals("decimal") || dataTypeName.Equals("numeric"))
            {
                columnBuilder.AppendFormat("({0},{1})", column.DataTypeNumericPrecision, column.DataTypeNumericScale);
            }
        }

        public void GenerateVisualStudioProjectFolders()
        {
            // When a folder does not contain any content it can be created by adding a [Folder] tag to the Visual Studio project file:
            // <ItemGroup>
            //      <Folder Include="StoredProcedures\" />
            // </ItemGroup>
            
            // It will be replaced by a [Content] tag, when a file is added to the folder in the Visual Studio project.
            // A folder will not be created on the filesystem, unless a file is added to the folder in the Visual Studio project.
            // <ItemGroup>
            //    <Content Include="Tables\Test.sql" />
            // </ItemGroup>

            // Standard database project folders:
            //<ItemGroup>
            //    <Folder Include="Database\" />
            //    <Folder Include="Functions\" />
            //    <Folder Include="Jobs\" />
            //    <Folder Include="Schemas\" />
            //    <Folder Include="Seed\" />
            //    <Folder Include="StoredProcedures\" />
            //    <Folder Include="Tables\" />
            //    <Folder Include="Tools\" />
            //    <Folder Include="Views\" />
            //</ItemGroup>
        }
    }

    
}