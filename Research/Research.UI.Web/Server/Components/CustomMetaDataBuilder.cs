
namespace Research.UI.Web.Server.Components
{
    using Newtonsoft.Json;
    using Research.UI.Web.Validation.EntityValidators;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Reflection;
    using System.Web;

    public interface ICustomMetaDataBuilder
    {
         string GetCustomMetaData(DbContext dbContext);
    }

    public class CustomMetaDataBuilder : ICustomMetaDataBuilder
    {
        public string GetCustomMetaData(DbContext dbContext)
        {
            var customMetaData = new CustomMetaData();
            Type type = dbContext.GetType();

            // Get all DbSets from DbContext.
            List<PropertyInfo> propertyInfos = type.GetProperties().Where(p => p.PropertyType.Name.Equals("DbSet`1")).ToList();

            // Proces DbSets.
            foreach (PropertyInfo propertyInfo in propertyInfos)
            {
                var structuralType = new StructuralType();

                // Proces Entity.
                Type entityType = propertyInfo.PropertyType.GenericTypeArguments[0];
                structuralType.@namespace = entityType.Namespace;
                structuralType.shortName = entityType.Name;

                // Get all entity validation attributes (Attribute must implement IEntityValidator).
                IEnumerable<Attribute> entityAttributes = entityType.GetCustomAttributes().Where(x => x is IEntityValidator);

                // Proces entity validation attributes.
                foreach (Attribute entityAttribute in entityAttributes)
                {
                    // Add entity validation attributes to custom metadata.
                    var metaData = new CustomEntityMetaData();
                    structuralType.custom.validators.Add(entityAttribute as IEntityValidator);
                }

                // Get all fields (SQL Server columns) per Entity (SQL Server Table).
                PropertyInfo[] epis = entityType.GetProperties();

                // Proces entity properties.
                foreach (PropertyInfo epi in epis)
                {
                    var dataProperty = new DataProperty
                    {
                        nameOnServer = epi.Name
                    };

                    if (epi.Name.Equals("Id", StringComparison.InvariantCultureIgnoreCase))
                    {
                        dataProperty.isPartOfKey = true;
                    }

                    // Get all field validation attributes.
                    IEnumerable<Attribute> epiAttributes = epi.GetCustomAttributes();

                    // Proces field validation attributes.
                    foreach (Attribute epiAttribute in epiAttributes)
                    {
                        dataProperty.custom.validators.Add(epiAttribute);
                    }

                    structuralType.dataProperties.Add(dataProperty);
                }

                customMetaData.structuralTypes.Add(structuralType);
            }

            return JsonConvert.SerializeObject(customMetaData);
        }
    }

    public class CustomMetaData
    {
        public CustomMetaData()
        {
            structuralTypes = new List<StructuralType>();
        }
        public List<StructuralType> structuralTypes { get; set; }
    }

    public class StructuralType
    {
        public StructuralType()
        {
            dataProperties = new List<DataProperty>();
            custom = new CustomEntityMetaData();
        }

        public string shortName { get; set; }
        public string @namespace { get; set; }
        public List<DataProperty> dataProperties { get; set; }
        public CustomEntityMetaData custom { get; set; }
    }

    public class DataProperty
    {
        public DataProperty()
        {
            custom = new CustomFieldMetaData();
            isPartOfKey = false;
        }
        public bool isPartOfKey { get; set; }
        public string nameOnServer { get; set; }
        public CustomFieldMetaData custom { get; set; }
    }

    public class CustomEntityMetaData
    {
        public CustomEntityMetaData()
        {
            validators = new List<IEntityValidator>();
        }

        public List<IEntityValidator> validators { get; set; }
    }

    public class CustomFieldMetaData
    {
        public CustomFieldMetaData()
        {
            validators = new List<Attribute>();
        }

        public List<Attribute> validators { get; set; }
    }     
}