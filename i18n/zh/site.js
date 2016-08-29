/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        // TODO: taken from here http://www.fao.org/fsnforum/zh
        // probably statistics is wrong in the link.
        // the one translated here is taken from the selected "statistics" in http://www.fao.org/statistics/zh/
        about_fao: "关于粮农组织",
        in_action: "在行动",
        countries: "国家",
        themes: "主题",
        media: "媒体",
        publications: "出版物",
        statistics: "统计资料",
        partnerships: "伙伴关系",
        
        fao_departments_and_offices: "粮农组织各部及办公室",
        contact_us: "与联系我们",
        terms_and_conditions: "条款和条件",
        scam_alert: "欺诈邮件",
        report_fraud: "欺诈举报",

        employment: "就业",
        procurement: "采购",
        governing_bodies: "领导机构",
        office_inspector_general: "监察长办公室",
        evaluation: "评价",
        legal_and_ethics_office: "法律及道德问题办公室",

        agriculture_and_consumer_protection: "农业及消费者保护",
        economic_and_social_development: "经济及社会发展",
        fisheries_and_aquaculture: "渔业及水产养殖",
        forestry: "林业",
        technical_cooperation: "技术合作",

        regional_office_for_africa: "非洲区域办事处",
        regional_office_for_asia_pacific: "亚洲及太平洋区域办事处",
        regional_office_for_europe_central_and_asia: "欧洲及中亚区域办事处",
        regional_office_for_latin_america_and_carribean: "拉丁美洲及加勒比区域办事处",
        regional_office_for_near_east_and_north_africa: "近东及北非区域办事处",
        country_offices: "分区域办事处",

        follow_us: "有关我们的信息请查看",
        download_your_app: "下载我们的应用程序"

    });

});