﻿
namespace Research.UI.Web.Server.Model
{
    using System.ComponentModel.DataAnnotations;

    public class Setting
    {
        [Key]    
        public int Id { get; set; }
        [Required]
        public string Key { get; set; }
        public string Value { get; set; }
    }
}