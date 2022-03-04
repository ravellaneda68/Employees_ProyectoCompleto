// @ts-nocheck
sap.ui.define([
    "logaligroup/Employees/controller/Base.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
    * @param {typeof sap.ui.core.mvc.Controller} Controller
    * @param {typeof sap.ui.model.Filter} Filter
    * @param {typeof sap.ui.model.FilterOperator} FilterOperator
    */
    function (Base, Filter, FilterOperator) {
        "use strict";
        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();
        };

        function onFilter() {
            var oJSONCountries = this.getView().getModel("jsonCountries").getData();
            var filters = [];

            if (oJSONCountries.EmployeeId !== "") {
                // @ts-ignore
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
            }
            if (oJSONCountries.CountryKey !== "") {
                // @ts-ignore
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
            }
            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);

        };
        function onClearFilter() {
            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
        };
        function showPostalCode(oEvent) {
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployees");
            var objectContext = oContext.getObject();
            sap.m.MessageToast.show(objectContext.PostalCode);
        };

        function onShowCity() {
            var oJsonModelConfig = this.getView().getModel("jsonModelConfig");
            oJsonModelConfig.setProperty("/visibleCity", true);
            oJsonModelConfig.setProperty("/visibleBtnShowCity", false);
            oJsonModelConfig.setProperty("/visibleBtnHideCity", true);
        };

        function onHideCity() {
            var oJsonModelConfig = this.getView().getModel("jsonModelConfig");
            oJsonModelConfig.setProperty("/visibleCity", false);
            oJsonModelConfig.setProperty("/visibleBtnShowCity", true);
            oJsonModelConfig.setProperty("/visibleBtnHideCity", false);
        };


        function showOrders(oEvent) {

            //Get selected controller
            var iconPressed = oEvent.getSource();

            //Context from the model
            var oContext = iconPressed.getBindingContext("odataNorthwind");

            if (!this.oDialogOrders) {
                this.oDialogOrders = sap.ui.xmlfragment("logaligroup.Employees.Fragment.DialogOrders", this);
                this.getView().addDependent(this.oDialogOrders);
            }
            //Dialog binding to the Context to have access to the data of selected item

            this.oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
            this.oDialogOrders.open();
        };

        function onCloseOrders() {
            this.oDialogOrders.close();
        };

        function showEmployee(oEvent) {
            var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
            this._bus.publish("flexible", "showEmployee", path);
        };
        
        var Main = Base.extend("logaligroup.Employees.controller.MasterEmployee", {});

        Main.prototype.onValidate = function () {
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                //inputEmployee.setDescription("OK");
                this.getView().byId("labelCountry").setVisible(true);
                this.getView().byId("slCountry").setVisible(true);

            } else {
                //inputEmployee.setDescription("Not OK");
                this.getView().byId("labelCountry").setVisible(false);
                this.getView().byId("slCountry").setVisible(false);
            }
        };

        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseOrders = onCloseOrders;
        Main.prototype.showEmployee = showEmployee;
     return Main;
    });