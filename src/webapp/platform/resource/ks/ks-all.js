/**
 * ks.all 模块，用于加载所需要的所有模块
 * @author Wangyiqun
 * @date 2014-12-29
 */
(function () {
    angular.module('ks.all',
        [
            // ui router
            'ui.router',

            // ngResource
            'ngResource',

            //ks 组件
            'ks.tip',
            'ks.supplierPicker',
            'ks.supplierKeywordPicker',
            'ks.manufacturerPicker',
            'ks.productPicker',
            'ks.cityPicker',
            'ks.countryPicker',
            'ks.autoComplete',
            'ks.categoryPicker',
            'ks.productPicker',
            'ks.customerPicker',
            'ks.customerKeywordPicker',
            'ks.accountCompanyPicker',
            'ks.salesPicker',
            'ks.organizationPicker',
            'ks.staffPicker',
            'ks.paging',
            'ks.cache',
            'ks.dialog',
            'ks.operator',
            'ks.selector',
            'ks.entityService',
            'ks.dicts',
            'ks.fileUpload',
            'ks.warehousePicker',
            'ks.progressBar',
            'ks.tree',
            'ks.checklist',
            'ks.tab',
            'ks.treePicker',
            'ks.orgPicker',
            'ks.checklist',
            'ks.multiSelector',
            'ks.multiRoleSelector',
            'ks.multiCategoryGroupSelector',
            'ks.multiDistrictSelector',
            'ks.form',
            'ks.viewPort',
            'ks.vBox',
            'ks.hBox',
            'ks.fillHeight',
            'ks.simpleGrid',
            'ks.companyPicker',
            'ks.simpleTab',
            'ks.datePicker',
            'ks.popUpPicker',
            'ks.enum',
            'ks.imgUpload',
            'ks.loading',
            'ks.chartsLine',
            'ks.statisticMenu',
            'ks.autoCompleteKw',
            'ks.ordernoPicker',
            'ks.purchaseOrderPicker',
            'ks.categoryKwPicker',
            'ks.companyKwPicker',
            'ks.cityKwPicker',
            'ks.staffKwPicker',
            'ks.designationKwPicker',
            'ks.productKwPicker',
            'ks.supplierBankPicker',

            //ui bootstrap
            'ui.bootstrap',
            'ui.bootstrap.tpls',
            'ui.bootstrap.transition'

        ]);
})();
