
namespace Research.Core.CodeGeneration.SqlScriptDtos
{
    using Research.Core.Components;
    using System.Collections.Generic;

    public class SqlScriptingInput
    {
        public List<string> Schemas { get; set; }
        public List<SqlTable> Tables { get; set; }
        public List<SqlTextObject> TextObjects { get; set; }
        public string RootFolder { get; set; }

        public SqlScriptingInput()
        {
            Schemas = new List<string>();
            Tables = new List<SqlTable>();
            TextObjects = new List<SqlTextObject>();
        }
    }

    public class SqlTable
    {
        public string Name { get; set; }
        public string Schema { get; set; }
        public List<SqlColumn> Columns { get; set; }
        public List<SqlForeignKey> ForeignKeys { get; set; }

        public SqlTable()
        {
            Columns = new List<SqlColumn>();
            ForeignKeys = new List<SqlForeignKey>();
        }
    }

    public class SqlColumn
    {
        public string DataTypeName { get; set; }
        public int DataTypeMaximumLength { get; set; }
        public int DataTypeNumericPrecision { get; set; }
        public int DataTypeNumericScale { get; set; }
        public string DefaultText { get; set; }
        public bool IsDefault { get; set; }
        public bool IsForeignKey { get; set; }
        public bool IsIdentity { get; set; }
        public bool IsNullable { get; set; }
        public long IdentityIncrement { get; set; }
        public long IdentitySeed { get; set; }
        public bool IsPrimaryKey { get; set; }
        public string Name { get; set; }
    }

    public class SqlForeignKey
    {
        // TODO: this is not a correct mapping, must be fixed (foreignkeys can span multiple columns)! 
        public string ColumnName { get; set; }
        public string ReferencedTableName { get; set; }
        public string ReferencedSchemaName { get; set; }
        public string ReferencedColumnName { get; set; }
    }

    public class SqlDeployScriptResult
    {
        public string Functions { get; set; }
        public string Schemas { get; set; }
        public string StoredProcedures { get; set; }
        public string Tables { get; set; }
        public string Views { get; set; }
    }

    public class SqlScriptingResult
    {
        public List<FileInfoDto> Scripts { get; set; }

        public SqlScriptingResult()
        {
            Scripts = new List<FileInfoDto>();
        }
    }

    public class SqlTextObject
    {
        public string TypeName { get; set; }    // function, view, procedure etc., used in the "drop" statement.
        public string GroupName { get; set; }   // Functions, Views, StoredProcedures etc., used when generating files.
        public string Name { get; set; }
        public string Schema { get; set; }
        public string TextBody { get; set; }
        public string TextHeader { get; set; }
    }
}
