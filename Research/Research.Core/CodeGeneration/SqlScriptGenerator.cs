
namespace Research.Core.CodeGeneration
{
    using Microsoft.SqlServer.Management.Common;
    using Microsoft.SqlServer.Management.Smo;
    using Research.Core.CodeGeneration.SqlScriptDtos;
    using Research.Core.Components;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text;

    public class SqlScriptGenerator
    {
        private const string tSQLtSchema = "tSQLt";

        public SqlScriptGenerator()
        {
        }

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
                MapSmoSchemasToSqlScriptDtos(database.Schemas.Cast<Schema>().Where(x => x.IsSystemObject == false), result);
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

        public SqlScriptingResult GenerateSqlScripts(SqlScriptingInput input)
        {
            var result = new SqlScriptingResult();

            HandleTables(result, input.Tables, input.RootFolder);
            HandleTextObjects(result, input.TextObjects, input.RootFolder);

            return result;
        }

        public SqlDeployScriptResult GenerateDeployScript(SqlScriptingInput input)
        {
            string fileExtension = ".sql";

            var result = new SqlDeployScriptResult();
            var tables = new StringBuilder(string.Empty);
            foreach (SqlTable table in input.Tables)
            {
                // Ignore "tSQLt" schema.
                if (!table.Schema.Equals(tSQLtSchema, System.StringComparison.InvariantCultureIgnoreCase))
                {
                    string name = string.Format("{0}.{1}{2}", table.Schema, table.Name, fileExtension);
                    string groupName = "Tables";
                    tables.AppendLine(string.Format(@"{0} ""{1}""", "call :runCmd", Path.Combine(groupName, name)));
                }
            }
            result.Tables = tables.ToString();

            var schemas = new StringBuilder(string.Empty);
            foreach (string schema in input.Schemas)
            {
                // Ignore "tSQLt" schema.
                if (!schema.Equals(tSQLtSchema, System.StringComparison.InvariantCultureIgnoreCase))
                {
                    schemas.AppendLine(Path.Combine("Schemas", schema));
                    schemas.AppendLine(string.Format(@"{0} ""{1}{2}""", "call :runCmd", Path.Combine("Schemas", schema), fileExtension));
                }
            }
            result.Schemas = schemas.ToString();

            var functions = new StringBuilder(string.Empty);
            var views = new StringBuilder(string.Empty);
            var storedProcedures = new StringBuilder(string.Empty);
            foreach (SqlTextObject textObject in input.TextObjects)
            {
                // Ignore "tSQLt" schema.
                if (!textObject.Schema.Equals(tSQLtSchema, System.StringComparison.InvariantCultureIgnoreCase))
                {
                    string name = string.Format("{0}.{1}{2}", textObject.Schema, textObject.Name, fileExtension);
                    string groupName = textObject.GroupName;

                    switch (groupName.ToLower())
                    {
                        case "functions":
                            functions.AppendLine(string.Format(@"{0} ""{1}""", "call :runCmd", Path.Combine(groupName, name)));
                            break;
                        case "views":
                            views.AppendLine(string.Format(@"{0} ""{1}""", "call :runCmd", Path.Combine(groupName, name)));
                            break;
                        case "storedprocedures":
                            storedProcedures.AppendLine(string.Format(@"{0} ""{1}""", "call :runCmd", Path.Combine(groupName, name)));
                            break;
                    }
                }
            }
            result.Functions = functions.ToString();
            result.Views = views.ToString();
            result.StoredProcedures = storedProcedures.ToString();

            return result;
        }

        public void MapSmoSchemasToSqlScriptDtos(IEnumerable<Schema> schemas, SqlScriptingInput input)
        {

            foreach (Schema schema in schemas)
            {
                input.Schemas.Add(schema.Name);
            }
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
                    DataType dataType = column.DataType;
                    string dateTypeName = Enum.GetName(dataType.SqlDataType.GetType(), dataType.SqlDataType).ToLower().Replace("max", string.Empty);

                    var sqlColumn = new SqlColumn
                    {
                        DataTypeMaximumLength = dataType.MaximumLength,
                        DataTypeName = dateTypeName,
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

        public void HandleTextObjects(SqlScriptingResult result, List<SqlTextObject> textObjects, string rootFolder)
        {
            foreach (SqlTextObject textObject in textObjects)
            {
                // Ignore "tSQLt" schema.
                if (!textObject.Schema.Equals(tSQLtSchema, System.StringComparison.InvariantCultureIgnoreCase))
                {
                    var contentBuilder = new StringBuilder(string.Empty);
                    string name = string.Format("[{0}].[{1}]", textObject.Schema, textObject.Name);

                    // Don't add drop statement for schema's.
                    if (!textObject.GroupName.ToLower().Equals("schema"))
                    {
                        AddTextObjectHeader(contentBuilder, name, textObject.TypeName);
                    }
                    contentBuilder.Append(textObject.TextHeader);
                    contentBuilder.Append(textObject.TextBody);
                    AddTextObjectFooter(contentBuilder);

                    AddScriptToResult(rootFolder, textObject.GroupName, textObject.Schema, textObject.Name, contentBuilder, result);
                }
            }
        }

        public void HandleTables(SqlScriptingResult result, List<SqlTable> tables, string rootFolder)
        {
            foreach (SqlTable table in tables)
            {
                // Ignore "tSQLt" schema.
                if (!table.Schema.Equals(tSQLtSchema, System.StringComparison.InvariantCultureIgnoreCase))
                {
                    var contentBuilder = new StringBuilder(string.Empty);
                    string name = string.Format("[{0}].[{1}]", table.Schema, table.Name);

                    AddTableHeader(contentBuilder, name, "table");
                    int totalColumnCount = table.Columns.Count;
                    for (int i = 0; i < totalColumnCount; i++)
                    {
                        SqlColumn column = table.Columns[i];
                        var columnBuilder = new StringBuilder(string.Empty);
                        columnBuilder.AppendFormat("        [{0}]", column.Name);
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

                    AddScriptToResult(rootFolder, "Tables", table.Schema, table.Name, contentBuilder, result);
                }
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
if object_id('{0}') is not null
begin
    drop {1} {0}
end
go
", name, typeName);
        }

        public void AddTextObjectFooter(StringBuilder contentBuilder)
        {
            contentBuilder.Append(Environment.NewLine);
            contentBuilder.Append("go");
        }

        public void AddTableFooter(StringBuilder contentBuilder)
        {
            contentBuilder.Append(@"    )
end
go
");
        }

        public void AddScriptToResult(string rootFolder, string folderName, string schema, string name, StringBuilder fileContent, SqlScriptingResult result)
        {
            string fileName = string.Format("{0}.{1}.sql", schema, name);
            string folderPath = string.IsNullOrWhiteSpace(rootFolder) ? folderName : Path.Combine(rootFolder, folderName);
            string path = Path.Combine(folderPath, fileName);
            var script = new FileInfoDto
            {
                Content = fileContent.ToString(),
                Path = path
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
                        string constraint = string.Format(" constraint FK_{0}_{1}_{2} foreign key references {3}.{4}({5})", table.Schema, table.Name, column.Name, fk.ReferencedSchemaName, fk.ReferencedTableName, fk.ReferencedColumnName);
                        constraint = RemoveInvalidCharacters(constraint);
                        columnBuilder.Append(constraint);
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
                string defaultText = GetDefaultText(column.DataTypeName, column.DefaultText);
                string constraint = string.Format(" constraint DF_{0}_{1}_{2} default ({3})", table.Schema, table.Name, column.Name, defaultText);
                constraint = RemoveInvalidCharacters(constraint);
                columnBuilder.Append(constraint);
            }
        }

        public string RemoveInvalidCharacters(string value)
        {
            if (string.IsNullOrWhiteSpace(value)){ throw new ArgumentException("Parameter can't be null, empty or contain only whitespaces.", "value"); }
            string result = value;
            result = result.Replace("&", string.Empty);
            result = result.Replace("-", string.Empty);
            return result;
        }

        /// <summary>
        /// NOTE: the following code is a hack. This should be generated by SMO, but I don't have the time to investigate the correct way.
        /// </summary>
        public string GetDefaultText(string dataTypeName, string defaultText)
        {
            if (string.IsNullOrWhiteSpace(dataTypeName)) { throw new ArgumentException("Parameter can't be null, empty or contain only whitespaces", "dataTypeName"); }

            if (
                dataTypeName.Equals("date", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("datetime", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("datetime2", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("datetimeoffset", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("smalldatetime", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("time", System.StringComparison.InvariantCultureIgnoreCase)
            )
            {
                return "getdate()";
            }

            if (dataTypeName.Equals("varchar", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("char", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("nchar", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("nvarchar", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("text", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("ntext", System.StringComparison.InvariantCultureIgnoreCase))
            {
                return "''";
            }

            if (
                dataTypeName.Equals("bigint", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("bit", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("decimal", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("int", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("money", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("numeric", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("smallint", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("smallmoney", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("tinyint", System.StringComparison.InvariantCultureIgnoreCase)
            )
            {
                return "0";
            }

            if (
                dataTypeName.Equals("uniqueidentifier", System.StringComparison.InvariantCultureIgnoreCase)
            )
            {
                return "newid()";
            }           

            if (string.IsNullOrWhiteSpace(defaultText))
            {
                throw new ArgumentException("Parameter can only be null, empty or contain only whitespaces, when dataTypeName is not in a know datatype.", "defaultText");
            }

            return defaultText;
        }

        public void HandlePrimaryKey(SqlTable table, SqlColumn column, StringBuilder columnBuilder)
        {
            if (column.IsPrimaryKey)
            {
                // TODO: this will break, when column is part of a composite primairy key.
                string constraint = string.Format(" constraint PK_{0}_{1}_{2} primary key", table.Schema, table.Name, column.Name);
                constraint = RemoveInvalidCharacters(constraint);
                columnBuilder.Append(constraint);
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