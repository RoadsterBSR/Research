
(function (hto) {
	"use strict";

	function User(dataService) {
		/// <summary>
		/// Represent a signature pad in the ui.
		/// </summary>
		var self = this;
		var _dataService = dataService;

		self.name = "User 1";
		self.password = "";		
	}

	hto.models.User = User;
	
}(hto));