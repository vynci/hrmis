/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('DashboardCalendarCtrl', DashboardCalendarCtrl);

  /** @ngInject */
  function DashboardCalendarCtrl(baConfig) {
    var dashboardColors = {
      vacation : '#90b900',
      sick : '#e85656',
      emergency : '#dfb81c'
    };
    console.log(dashboardColors);
    var $element = $('#calendar').fullCalendar({
      //height: 335,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      defaultDate: new Date(),
      selectable: true,
      selectHelper: true,
      select: function (start, end) {
        console.log('select!');
        var title = prompt('Employee Name:');
        var eventData;
        if (title) {
          eventData = {
            title: title,
            start: start,
            end: end,
            leaveType : leaveType
          };
          $element.fullCalendar('renderEvent', eventData, true); // stick? = true
        }
        $element.fullCalendar('unselect');
      },
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      eventClick : function(calEvent){
        console.log(calEvent);
      },
      events: [
        {
          title: 'Joel Encina',
          start: '2017-03-01',
          color: dashboardColors.sick
        },
        {
          title: 'Dirk Nowitski',
          start: '2017-03-01',
          color: dashboardColors.sick
        },
        {
          title: 'Stephen Curry',
          start: '2017-03-01',
          color: dashboardColors.emergency
        },
        {
          title: 'Kobe Bryant',
          start: '2017-03-07',
          end: '2017-03-10',
          color: dashboardColors.vacation
        },
        {
          title: 'Dirk Nowitski',
          start: '2017-03-14',
          color: dashboardColors.vacation
        },
        {
          title: 'Stephen Curry',
          start: '2017-03-19',
          color: dashboardColors.vacation
        },
        {
          title: 'James Harden',
          start: '2017-04-01',
          color: dashboardColors.emergency
        }
      ]
    });
  }
})();
