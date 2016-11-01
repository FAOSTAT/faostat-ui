/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        // bulk downloads
        bulk_download: "批量下载",
        all_faostat_data: "全部粮农组织统计数据库数据",
        updated_on: "更新至",

        // database updates
        database_updates: "数据库更新",

        // Statistical Yearbook
        fao_statistical_yearbooks: "粮农组织统计年鉴",
        fao_statistical_yearbooks_text: "粮农组织统计年检按国家提供了一系列关于农业和粮食的指标。年鉴的第一部分包括了各种主题的可视化数据（图，表，和地图）以及基本的文本。第二部分有一些选定指标的国家数据表格。",

        // country indicators
        country_indicators: "国家指标",
        country_indicators_text: "国家指标按国家概观关键指标和图表。",

        // Rankings
        rankings: "排名",
        rankings_text: "排名指标按商品概观关键指标和图表",

        // Food security in the 2030 Agenda for Sustainable Development
        development_goals: "2030年可持续发展议程》中的粮食与农业",
        development_goals_text: "2030年可持续发展议程》包括了17个可持续发展目标（SDGs），这些新的全球性目标在2016年1月帮助实现了千年发展目标。该SDGs将帮助塑造未来十五年的国家发展机会。<br><br>从消除贫困与饥饿到应对气候变化和维护我们的自然资源，粮食与农业是2030年议程的核心重点。",

        // Contacts
        rome: "罗马",
        italy: "意大利",
        info: "信息",

        explore_data: "浏览数据",
        explore_data_title: "粮食和农业数据",
        explore_data_text: "粮农组织统计数据库为245多个国家以及地区提供免费的粮食和农业数据， 其涵盖了所有粮农组织（FAO）区域各组自1961年以来至最近可获取的所有数据。"

    });

});