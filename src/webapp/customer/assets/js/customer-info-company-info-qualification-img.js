/**
 * Created by wendy-pc on 2016/8/1.
 */
Polymer({
    is: "customer-info-company-info-qualification-img",
    behaviors:[OCrudBehavior],
    properties: {
        company: {
            type: Object,
            notify: true,
            observer: "_imgChange"  //监听公司的变化
        },
        imgUrl: {
            type: String,
            notify: true
        },
        imgUrl1: {
            type: String,
            notify: true
        },
        imgUrl2: {
            type: String,
            notify: true
        },
        imgUrl3: {
            type: String,
            notify: true
        }
    },
    /**
     * 根据公司改变附件的url(imgUrl)
     */
    _imgChange: function (newVal, oldVal) {
        if (!newVal) {
            return;
        }
        var imageBaseUrl = this.getRoot() + '/management/attachments/'
        if (this.company && this.company.orgColligateAid) {
            this.imgUrl = imageBaseUrl + this.company.orgColligateAid + ".do"
        }
        if (this.company && this.company.orgLicenseAid) {
            this.imgUrl1 = imageBaseUrl + this.company.orgLicenseAid + ".do"
        }
        if (this.company && this.company.orgCodeAid) {
            this.imgUrl2 = imageBaseUrl + this.company.orgCodeAid + ".do"
        }
        if (this.company && this.company.orgTaxAid) {
            this.imgUrl3 = imageBaseUrl + this.company.orgTaxAid + ".do"
        }
    },
});
