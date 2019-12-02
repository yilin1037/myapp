/**
* jQuery MiniUI v3.0
* 
* Web Site : http://www.miniui.com
*
* Commercial License : http://www.miniui.com/license
*
* Copyright(c) 2012 All Rights Reserved. Shanghai PusSoft Co., Ltd (上海普加软件有限公司) [ services@plusoft.com.cn ]. 
* 
*/


mini.locale = "LanguagePack";


/* Date
-----------------------------------------------------------------------------*/

mini.dateInfo = {
    monthsLong: [L('miniui-jan','MINIUI'), L('miniui-february','MINIUI'), L('miniui-march','MINIUI'), L('miniui-april','MINIUI'), L('miniui-may','MINIUI'), L('miniui-june','MINIUI'), L('miniui-july','MINIUI'), L('miniui-august','MINIUI'), L('miniui-september','MINIUI'), L('miniui-october','MINIUI'), L('miniui-november','MINIUI'), L('miniui-december','MINIUI')],
    monthsShort: [L('miniui-january1','MINIUI'), L('miniui-february1','MINIUI'), L('miniui-march1','MINIUI'), L('miniui-april1','MINIUI'), L('miniui-may1','MINIUI'), L('miniui-june1','MINIUI'), L('miniui-july1','MINIUI'), L('miniui-august1','MINIUI'), L('miniui-september1','MINIUI'), L('miniui-october1','MINIUI'), L('miniui-november1','MINIUI'), L('miniui-december1','MINIUI')],
    daysLong: [L('miniui-onSunday','MINIUI'), L('miniui-monday','MINIUI'), L('miniui-tuesday','MINIUI'), L('miniui-wednesday','MINIUI'), L('miniui-thursday','MINIUI'), L('miniui-friday','MINIUI'), L('miniui-onSaturday','MINIUI')],
    daysShort: [L('miniui-su','MINIUI'), L('miniui-mo','MINIUI'), L('miniui-tu','MINIUI'), L('miniui-we','MINIUI'), L('miniui-th','MINIUI'), L('miniui-fr','MINIUI'), L('miniui-sa','MINIUI')],
    quarterLong: [L('miniui-firstQuarter','MINIUI'), L('miniui-inTheSecondQuarter','MINIUI'), L('miniui-threeQuarters','MINIUI'), L('miniui-fourthQuarter','MINIUI')],
    quarterShort: ['Q1', 'Q2', 'Q2', 'Q4'],
    halfYearLong: [L('miniui-firstHalf','MINIUI'), L('miniui-secondHalf','MINIUI')],
    patterns: {
        "d": "yyyy-M-d",
        "D": "yyyy"+L('miniui-year','MINIUI')+"M"+L('miniui-month','MINIUI')+"d"+L('miniui-japan','MINIUI'),
        "f": "yyyy"+L('miniui-year','MINIUI')+"M"+L('miniui-month','MINIUI')+"d"+L('miniui-japan','MINIUI')+" H:mm",
        "F": "yyyy"+L('miniui-year','MINIUI')+"M"+L('miniui-month','MINIUI')+"d"+L('miniui-japan','MINIUI')+" H:mm:ss",
        "g": "yyyy-M-d H:mm",
        "G": "yyyy-M-d H:mm:ss",
        "m": "MMMd"+L('miniui-japan','MINIUI'),
        "o": "yyyy-MM-ddTHH:mm:ss.fff",
        "s": "yyyy-MM-ddTHH:mm:ss",
        "t": "H:mm",
        "T": "H:mm:ss",
        "U": "yyyy"+L('miniui-year','MINIUI')+"M"+L('miniui-month','MINIUI')+"d"+L('miniui-japan','MINIUI')+" HH:mm:ss",
        "y": "yyyy"+L('miniui-year','MINIUI')+"MM"+L('miniui-month','MINIUI')
    },
    tt: {
        "AM": L('miniui-morning','MINIUI'),
        "PM": L('miniui-inTheAfternoon','MINIUI')
    },
    ten: {
        "Early": L('miniui-early','MINIUI'),
        "Mid": L('miniui-inMid','MINIUI'),
        "Late": L('miniui-inLate','MINIUI')
    },
    today: L('miniui-today','MINIUI'),
    clockType: 24
};


/* Calendar
-----------------------------------------------------------------------------*/
if (mini.Calendar) {
    mini.copyTo(mini.Calendar.prototype, {
        firstDayOfWeek: 0,
        todayText: L('miniui-today','MINIUI'),
        clearText: L('miniui-remove','MINIUI'),
        okText: L('miniui-determine','MINIUI'),
        cancelText: L('miniui-cancel','MINIUI'),
        daysShort: [L('miniui-su','MINIUI'), L('miniui-mo','MINIUI'), L('miniui-tu','MINIUI'), L('miniui-we','MINIUI'), L('miniui-th','MINIUI'), L('miniui-fr','MINIUI'), L('miniui-sa','MINIUI')],
        format: "yyyy"+L('miniui-year','MINIUI')+"MM"+L('miniui-month','MINIUI'),

        timeFormat: 'H:mm'
    });
}


/* required | loadingMsg
-----------------------------------------------------------------------------*/
for (var id in mini) {
    var clazz = mini[id];
    if (clazz && clazz.prototype && clazz.prototype.isControl) {
        clazz.prototype.requiredErrorText = L('miniui-canNotBeEmpty','MINIUI');
        clazz.prototype.loadingMsg = "Loading...";
    }

}
/* VTypes
-----------------------------------------------------------------------------*/
if (mini.VTypes) {
    mini.copyTo(mini.VTypes, {
        minDateErrorText: L('miniui-dateNotLessThan0','MINIUI'),
        maxDateErrorText: L('miniui-dateCanNotBeGreater','MINIUI'),

        uniqueErrorText: L('miniui-fieldCanNotBeRepeated','MINIUI'),
        requiredErrorText: L('miniui-canNotBeEmpty','MINIUI'),
        emailErrorText: L('miniui-pleaseEnterTheMessageFormat','MINIUI'),
        urlErrorText: L('miniui-pleaseEnterAURLFormat','MINIUI'),
        floatErrorText: L('miniui-pleaseEnterTheNumber','MINIUI'),
        intErrorText: L('miniui-pleaseEnterAnInteger','MINIUI'),
        dateErrorText: L('miniui-pleaseEnterTheDateFormat','MINIUI'),
        maxLengthErrorText: L('miniui-canNotExceed0Characters','MINIUI'),
        minLengthErrorText: L('miniui-notLessThan0Characters','MINIUI'),
        maxErrorText: "L('miniui-theNumberCanNotBe','MINIUI') ",
        minErrorText: "L('miniui-numberCanNotBeLess','MINIUI') ",
        rangeLengthErrorText: L('miniui-0MustBeTo1','MINIUI'),
        rangeCharErrorText: L('miniui-stringMustBetween','MINIUI'),
        rangeErrorText: L('miniui-theNumberMustBeIn','MINIUI')
    });
}

/* Pager
-----------------------------------------------------------------------------*/
if (mini.Pager) {
    mini.copyTo(mini.Pager.prototype, {
        firstText: L('miniui-home','MINIUI'),
        prevText: L('miniui-previous','MINIUI'),
        nextText: L('miniui-next','MINIUI'),
        lastText: L('miniui-lastPage','MINIUI'),
        pageInfoText: L('miniui-page0OfAbout1','MINIUI')
    });
}

/* DataGrid
-----------------------------------------------------------------------------*/
if (mini.DataGrid) {
    mini.copyTo(mini.DataGrid.prototype, {
        emptyText: L('miniui-noDataReturned','MINIUI')
    });
}

if (mini.FileUpload) {
    mini.FileUpload.prototype.buttonText = L('miniui-browse','MINIUI')
}
if (mini.HtmlFile) {
    mini.HtmlFile.prototype.buttonText = L('miniui-browse','MINIUI')
}

/* Gantt
-----------------------------------------------------------------------------*/
if (window.mini.Gantt) {
    mini.GanttView.ShortWeeks = [
        L('miniui-japan','MINIUI'), L('miniui-one','MINIUI'), L('miniui-two','MINIUI'), L('miniui-three','MINIUI'), L('miniui-four','MINIUI'), L('miniui-five','MINIUI'), L('miniui-six','MINIUI')
    ];
    mini.GanttView.LongWeeks = [
        L('miniui-onSunday','MINIUI'), L('miniui-monday','MINIUI'), L('miniui-tuesday','MINIUI'), L('miniui-wednesday','MINIUI'), L('miniui-thursday','MINIUI'), L('miniui-friday','MINIUI'), L('miniui-onSaturday','MINIUI')
    ];

    mini.Gantt.PredecessorLinkType = [
        { ID: 0, Name: L('miniui-finishCompleteFF','MINIUI'), Short: 'FF' },
        { ID: 1, Name: L('miniui-completeStartFS','MINIUI'), Short: 'FS' },
        { ID: 2, Name: L('miniui-startCompleteSF','MINIUI'), Short: 'SF' },
        { ID: 3, Name: L('miniui-startStartSS','MINIUI'), Short: 'SS' }
    ];

    mini.Gantt.ConstraintType = [
        { ID: 0, Name: L('miniui-theSoonerTheBetter','MINIUI') },
        { ID: 1, Name: L('miniui-asLateAsPossible','MINIUI') },
        { ID: 2, Name: L('miniui-mustBeginAt','MINIUI') },
        { ID: 3, Name: L('miniui-mustBeCompleted','MINIUI') },
        { ID: 4, Name: L('miniui-startingNoEarlierThan','MINIUI') },
        { ID: 5, Name: L('miniui-startingNoLaterThan','MINIUI') },
        { ID: 6, Name: L('miniui-completedNoEarlierThan','MINIUI') },
        { ID: 7, Name: L('miniui-completedNoLaterThan','MINIUI') }
    ];

    mini.copyTo(mini.Gantt, {
        ID_Text: L('miniui-identificationNumber','MINIUI'),
        Name_Text: L('miniui-taskName','MINIUI'),
        PercentComplete_Text: L('miniui-progress','MINIUI'),
        Duration_Text: L('miniui-duration','MINIUI'),
        Start_Text: L('miniui-startDate','MINIUI'),
        Finish_Text: L('miniui-completionDate','MINIUI'),
        Critical_Text: L('miniui-missionCritical','MINIUI'),

        PredecessorLink_Text: L('miniui-predecessors','MINIUI'),
        Work_Text: L('miniui-hours','MINIUI'),
        Priority_Text: L('miniui-severity','MINIUI'),
        Weight_Text: L('miniui-weight','MINIUI'),
        OutlineNumber_Text: L('miniui-outlineField','MINIUI'),
        OutlineLevel_Text: L('miniui-taskHierarchy','MINIUI'),
        ActualStart_Text: L('miniui-actualStartDate','MINIUI'),
        ActualFinish_Text: L('miniui-theActualCompletionDate','MINIUI'),
        Wbs_Text: L('miniui-wbs','MINIUI'),
        ConstraintType_Text: L('miniui-limitType','MINIUI'),
        ConstraintDate_Text: L('miniui-blackoutDates','MINIUI'),
        Department_Text: L('miniui-department','MINIUI'),
        Principal_Text: L('miniui-personInCharge','MINIUI'),
        Assignments_Text: L('miniui-resourceName','MINIUI'),

        Summary_Text: L('miniui-summaryTask','MINIUI'),
        Task_Text: L('miniui-task','MINIUI'),
        Baseline_Text: L('miniui-benchmark','MINIUI'),
        LinkType_Text: L('miniui-linkType','MINIUI'),
        LinkLag_Text: L('miniui-lagTime','MINIUI'),
        From_Text: L('miniui-from','MINIUI'),
        To_Text: L('miniui-to','MINIUI'),

        Goto_Text: L('miniui-goToTask','MINIUI'),
        UpGrade_Text: L('miniui-upgrade','MINIUI'),
        DownGrade_Text: L('miniui-demote','MINIUI'),
        Add_Text: L('miniui-added','MINIUI'),
        Edit_Text: L('miniui-editor','MINIUI'),
        Remove_Text: L('miniui-delete','MINIUI'),
        Move_Text: L('miniui-move','MINIUI'),
        ZoomIn_Text: L('miniui-enlarge','MINIUI'),
        ZoomOut_Text: L('miniui-narrow','MINIUI'),
        Deselect_Text: L('miniui-deselect','MINIUI'),
        Split_Text: L('miniui-splitTask','MINIUI')


    });

}

/* MessageBox
-----------------------------------------------------------------------------*/
if (mini.MessageBox) {
    mini.copyTo(mini.MessageBox, {
        alertTitle: L('miniui-alertTitle','MINIUI'),
        confirmTitle: L('miniui-confirmTitle','MINIUI'),
        prompTitle: L('miniui-prompTitle','MINIUI'),
        prompMessage: L('miniui-prompMessage','MINIUI'),
        buttonText: {
            ok: L('miniui-ok','MINIUI'), //"OK",
            cancel: L('miniui-cancel','MINIUI'), //"Cancel",
            yes: L('miniui-yes','MINIUI'), //"Yes",
            no: L('miniui-no','MINIUI')//"No"
        }
    });
};