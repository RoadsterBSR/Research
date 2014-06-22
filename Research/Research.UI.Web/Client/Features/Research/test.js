


// var viewModel = kendo.observable(options);



var routeMaker = routeMaker || {};
routeMaker.features = routeMaker.features || {};
routeMaker.features.beheer = routeMaker.features.beheer || {};
routeMaker.features.beheer.ViewModel = {
    
    /// <field name='firstName' type='String'>The first name.</field>
    firstName: "John",
    lastName : "Doe",
    fullName : function () {
        return this.get("firstName") + " " + this.get("lastName");
    }
    
    
};

routeMaker.features.beheer.controler = (function () {
    var self = {};

    
    self.getViewModel = function () {
        return new routeMaker.features.beheer.ViewModel();
    };
    
    var _viewModel = self.getViewModel();
       

    return self;
})();


