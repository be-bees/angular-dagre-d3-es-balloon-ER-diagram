import { Component } from '@angular/core';
import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3-es';
import $ from 'jquery';
import { treeData } from './data';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular1';
  constructor() {}

  options = treeData;
  ngAfterViewInit() {
    this.createGraph(this.options);
  }
  createGraph(options) {
    console.log('ng');

    var getThisSelector = $('#root');
    console.log('getThisSelector', getThisSelector);

    var settings = $.extend(
      {
        diagramData: '',
      },
      options
    );
    // optionsCreate a new directed graph
    $(getThisSelector).addClass('erdiagramactive');
    $(getThisSelector).data('thiserdata', settings);

    var data = $(getThisSelector).data('thiserdata').diagramData;
    var basicHtml = `<div id="diagramContainer" class="cs-erdiagram">
                        <svg  xmlns="http://www.w3.org/2000/svg" class="erdiagramsvg" id="svgcontainer"></svg>
                      </div>
                      <div class="clearfix erdiagramcloneblock"></div>`;
    $(getThisSelector).append(basicHtml);
    $(getThisSelector).data('fullObjDate', data.offlineObjectDetails);
    //dev side code
    $(getThisSelector).data('objectPrimaryDetails', data.objectPrimaryDetails);
    if ($('#isGlobalSearchEnabled').val() == 'Y')
      $('#isGlobalSearchEnabledToggle').prop('checked', true);
    else $('#isGlobalSearchEnabledToggle').prop('checked', false);
    //
    var xx =
      '.userhierarchysvgwhitebg{background-color:white}.cs-ad-hierarchymain .cs-ad-hierarchychatarea .svgmainstartingtag{width:100%;height:100%}.link{transform:rotateX(0) rotateY(180deg) rotateZ(90deg) translate(50px,-110px);fill:none;stroke:#ccc;stroke-width:1.5px}.cs-d3-markercircle{fill:#7fcbf5}.node text{font-size:12px;fill:#a1a1a1;font-family:open-sans-regular,Helvetica Neue,Helvetica,Arial,sans-serif}.node .emp-name{fill: #000;font-weight: 600;font-size: 13px;}.cs-ad-hierarchymain .cs-ad-hierarchychatarea .eachpersonbox{fill:#fff;stroke:#b1b1b1;stroke-width:1px;-webkit-transition:all 1.1s;-moz-transition:all 1.1s;-ms-transition:all 1.1s;-o-transition:all 1.1s}.cs-ad-hierarchymain .cs-ad-hierarchychatarea .eachboxshadow{fill:#b1b1b1;-webkit-transition:all 1.1s;-moz-transition:all 1.1s;-ms-transition:all 1.1s;-o-transition:all 1.1s}.cs-ad-hierarchymain .cs-ad-hierarchychatarea .emp-mail,.cs-ad-hierarchymain .cs-ad-hierarchychatarea .moredetails{opacity:1;-webkit-transition:all 6s;-moz-transition:all 6s;-ms-transition:all 6s;-o-transition:all 6s}.cs-ad-hierarchymain .cs-ad-hierarchychatarea .emp-mail{fill:#a1a1a1;font-size:11px}.cs-ad-hierarchymain .cs-ad-hierarchychatarea .userimage{width:55px;height:55px}.node .emproll-text{fill:#1991ff;font-weight:600;font-size:11px;background:#f3f9fe;border-radius:10px;padding:2px 5px}.node .abovemebgrect,.node .belowmebgrect{width:17px;height:17px;fill:#fff;stroke:#f2f2f2;stroke-width:1px;border-radius:50%;visibility:hidden;cursor:pointer}.node .emp-abovelist{visibility:hidden;fill:#26a65b;cursor:pointer}.node .emp-belowlist{visibility:hidden;fill:#f0ad4e;cursor:pointer}.cs-ad-hierarchymain .cs-ad-hierarchychatarea .emp-name{fill:#000;font-weight:600;font-size:13px;cursor:pointer}.cs-ad-hierarchymain.cs-ad-hideusermoredetails .cs-ad-hierarchychatarea .eachboxshadow{fill:transparent}.cs-ad-hierarchymain.cs-ad-hideusermoredetails .emp-mail,.cs-ad-hierarchymain.cs-ad-hideusermoredetails .moredetails{opacity:0;-webkit-transition:all .4s;-moz-transition:all .4s;-ms-transition:all .4s;-o-transition:all .4s}';
    var createstyleElement = document.createElement('style');
    createstyleElement.setAttribute('type', 'text/css');
    createstyleElement.innerHTML = xx;
    $('.cs-erdiagram svg').append(createstyleElement);
    var g = new dagreD3.graphlib.Graph().setGraph({
      nodesep: 100,
      ranksep: 40,
      rankdir: 'TB',
      ranker: 'longest-path',
      marginx: 20,
      marginy: 20,
    }); /*
          .setDefaultEdgeLabel(function () {
          return {};
      })*/
    //$.getJSON("../../json/appDesigner/ERoffline.json",function(data){
    data.offlineObjectDetails.forEach(function (node) {
      var listinfo = '';
      var getThisFieldsHtml = '';
      node.fields.forEach(function (fieldsList, fieldIndex) {
        var objectFields = fieldsList.fieldName;
        var fieldType = '';
        var dataref;
        var reffieldobid;
        var lookupHtml = '';
        if (
          fieldsList.relationShipType == undefined ||
          fieldsList.relationShipType == ''
        ) {
          fieldsList.fieldType == 'LOOKUP'
            ? (reffieldobid = fieldsList.fieldType)
            : (reffieldobid = '');
          var getFilter;
          if (fieldsList.fieldType == 'LOOKUP') {
            if (fieldsList.referenceObjectType != 'STATIC') {
              var getRefObjId = fieldsList.referenceObjectId;
              getFilter = data.offlineObjectDetails.filter(
                (getData) => getData.objectId === getRefObjId
              );
              if (getFilter != undefined && getFilter.length > 0) {
                listinfo += `<div class="cs-info-block"><span class="cs-infolabel lookuplabel">Lookup</span> <span class="cs-infofor">for</span> <span class="cs-infoobj cs-truncate cs-inline" style="max-width:125px">${getFilter[0].objectName}</span></div>`;
                lookupHtml = `<div class="cs-er-lkp"><span>Lookup</span> <span class="cs-er-lkp-f">for </span><span>${convertStringToCharEntity(
                  getFilter[0].objectName
                )}</span></div>`;
              }
            }
          }
        } else {
          reffieldobid = fieldsList.relationShipType;
          var getFiltr;
          var getRefObjIdd = fieldsList.referenceObjectId;
          getFiltr = data.offlineObjectDetails.filter(
            (getData) => getData.objectId === getRefObjIdd
          );
          if (getFiltr != undefined && getFiltr.length > 0)
            listinfo += `<div class="cs-info-block"><span class="cs-infolabel masterlabel">Master</span> <span class="cs-infofor">for</span> <span class="cs-infoobj cs-truncate cs-inline" style="max-width:125px">${getFiltr[0].objectName}</span></div>`;
        }

        reffieldobid == undefined ? reffieldobid : 0;
        fieldsList.referenceObjectId != '0'
          ? (dataref = fieldsList.referenceObjectId)
          : (dataref = '');
        fieldsList.isUnique == 'Y' ? (fieldType = 'unique') : 0;
        fieldsList.isRequired == 'Y' ? (fieldType = 'mandatory') : 0;
        fieldsList.isPrimary == 'Y' ? (fieldType = 'primary') : 0;
        var globalsearchEnableClassName = '';
        var globalSearchClass = '';
        var searchIndexClass = '';
        var searchIndexEnableClassName = '';
        var searchIndexEnableFromForm = '';
        // var isStatusWFEnabled = fieldsList.isStatusWFEnabled != undefined ? fieldsList.isStatusWFEnabled : "";
        var globalSearchRestrictedFields = [
          'GEOLOCATION',
          'ROLLUPSUMMARY',
          'FORMULA',
          'LOOKUP',
          'MASTERDETAIL',
          'RICHTEXT',
          'PASSWORD',
        ];
        var searchIndexRestrictedFiedlds = [
          'GEOLOCATION',
          'RICHTEXT',
          'PASSWORD',
        ];
        var isPrimaryField =
          fieldsList.isPrimaryField != undefined
            ? fieldsList.isPrimaryField
            : '';
        var pointerEventNone = '';
        if (fieldsList.fieldType != 'HIDDEN') {
          if (!globalSearchRestrictedFields.includes(fieldsList.fieldType)) {
            globalSearchClass =
              '<span class="cs-tc cs-grey-lighten cs-er-assignglobalbtn cs-er-bxli-actions cs-rsmar' +
              pointerEventNone +
              '" style="visibility:hidden; float:right; cursor:pointer; line-height:1"><i class="icon-cs-solr-search-engine cs-ts-14"></i></span>';
            fieldsList.isGlobalSearchEnabled == 'Y'
              ? (globalsearchEnableClassName = 'globalsearchconfigactive')
              : '';
          }
          if (!searchIndexRestrictedFiedlds.includes(fieldsList.fieldType)) {
            if (fieldsList.isIndexFieldEnable == 'Y') {
              searchIndexEnableClassName = 'indexSearchActive';
              searchIndexEnableFromForm = ' cs-pe-none';
            } else if (fieldsList.isIndexFieldEnable == 'MANUAL') {
              searchIndexEnableClassName = 'indexSearchActive';
              searchIndexEnableFromForm = '';
            }
            if (pointerEventNone == 'cs-pe-none') {
              searchIndexClass =
                '<span class="cs-tc cs-grey-lighten cs-er-assignIndexbtn cs-er-bxli-actions cs-rsmar' +
                pointerEventNone +
                '" style="visibility:hidden; float:right; cursor:pointer; line-height:1"><i class="icon-cs-filter-o cs-ts-14"></i></span>';
            } else {
              searchIndexClass =
                '<span class="cs-tc cs-grey-lighten cs-er-assignIndexbtn cs-er-bxli-actions cs-rsmar' +
                searchIndexEnableFromForm +
                ' " style="visibility:hidden; float:right; cursor:pointer; line-height:1"><i class="icon-cs-filter-o cs-ts-14"></i></span>';
            }
          }

          if (fieldsList.fieldType == 'RECORDASSOCIATION') {
            globalSearchClass =
              '<span class="cs-tc cs-grey-lighten cs-er-assignglobalbtn cs-er-bxli-actions cs-rsmar' +
              pointerEventNone +
              '" style="visibility:hidden; float:right; cursor:pointer; line-height:1"></span>';
            fieldsList.isGlobalSearchEnabled == 'Y'
              ? (globalsearchEnableClassName = 'globalsearchconfigactive')
              : '';
          }
        }
        var fieldstype = fieldsList.fieldType;
        var iconClass = 'icon-mat-add';
        getThisFieldsHtml +=
          '<li data-refob="' +
          dataref +
          '" objectName="' +
          convertStringToCharEntity(node.objectName) +
          '" objectid="' +
          node.objectId +
          '" iconName="' +
          fieldsList.fieldType +
          '" thisfieldid="' +
          fieldsList.fieldId +
          '" isPrimaryField="' +
          isPrimaryField +
          '"isIndexed = "' +
          fieldsList.isIndexFieldEnable +
          '" thisfieldtype="' +
          fieldsList.fieldType +
          '"title="' +
          convertStringToCharEntity(objectFields) +
          '" data-connection="' +
          reffieldobid +
          '" style="margin:0; padding: 7px 10px; position: relative; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px; display:flex;align-items:center;" class="cs-er-eachfieldli cs-bline ' +
          globalsearchEnableClassName +
          ' ' +
          searchIndexEnableClassName +
          ' ' +
          fieldType +
          '">' +
          '<span class="cs-er-bxli-actions" style="display:inline-flex;float:left"><span class="sprite cs-tooltip-top cs-pull-left ' +
          iconClass +
          '" style="display:inline-block; width:20px;margin-right:5px;" title="' +
          fieldsList.fieldType +
          '"></span></span>' +
          '<span class="cs-pinobjectfield cs-truncate" style="display:inline-block; width:calc(100% - 85px)">' +
          convertStringToCharEntity(objectFields) +
          '</span>' +
          lookupHtml +
          '' +
          '<div style="width:60px;display:inline-flex;align-items:center;justify-content: end;">' +
          searchIndexClass +
          '<span class="cs-er-mf cs-rmar cs-pull-right cs-er-bxli-actions" style="color:#9eadfe;display:none">M</span>' +
          '<span class="cs-er-uf cs-rmar cs-pull-right cs-er-bxli-actions" style="display:none"><i class="fa fa-map-pin"></i></span>' +
          globalSearchClass +
          '</div>' +
          '</li>';
        // getThisFieldsHtml += `<li data-refob="${dataref}" title="${objectFields}" data-connection="${reffieldobid}" style="margin:0; padding: 7px 20px; position: relative; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px;" class="cs-er-eachfieldli ${fieldType}">${objectFields}</li>`;
      });
      var noinfo = `<div class="cs-info-block">No Dependency</div>`;
      var objectId = node.objectId;
      var objectName = node.objectName;
      var fieldCount = node.fields.length;
      var getThisObjNameMainBlock = `
                <div id="item_${objectName}" style="border-radius: 3px; width: 230px; background: none; position:relative;" class="item cs-pr cs-bg-white cs-parentfilter " objectid="${objectId}">
                  <h2 style="width:100%; font-size:16px; font-family: open-sans-semibold; font-weight:normal; display: inline-flex; align-items: center; position: relative; margin:0 0 0 5px;">
                    <span title="${convertStringToCharEntity(
                      objectName
                    )}" style="max-width:125px;" class="cs-tn cs-truncate cs-inline cs-whitec cs-er-objname cs-tw-600">${convertStringToCharEntity(
        objectName
      )}</span>
                    <!--<span style="margin-left:5px; display: flex; align-items: center; justify-content: center; width: 34px; height: 19px;background: #f59f00; border-radius: 500px; font-size: 12px; color: #ffffff;">${fieldCount}</span>-->
                    <!--<div class="cs-pa" style="right:10px">
                   
                       <span class="cs-cur cs-infoclick">
                        <i style="color:#22a7f0; margin-right:5px;" class="icon-cs-info-circle"></i>
                        <div class="cs-infodrop" style="display:none">
                          ${listinfo.length > 5 ? listinfo : noinfo}
                        </div>
                      </span>
  
                      <span class="cs-cur cs-filterclick"><i class="cs-filtertoggle icon-cs-filter-o " ></i>
                        <div class="cs-dropdownfilter" style="display:none">
                          <ul class="cs-dropdownfilterul">
                            <li>All</li>
                            <li>Lookup Field</li>
                            <li>Master Field</li>
                            <li>Mandatory Field</li>
                            <li>Unique Field</li>
                          </ul>
                        </div>
                      </span>
  
                    </div>-->
                  </h2>
                  <ul style="list-style: none;border-radius:0px 0px 10px 10px!important; position:relative;top:11px; padding:0px; margin: 0px -10px 0px -10px; border-radius: 3px; max-height:215px; background:#fff" class="cs-scroll-2 cs-childul">${getThisFieldsHtml}</ul>
                </div>`;

      g.setNode(node.objectName, {
        labelType: 'html',
        label: getThisObjNameMainBlock,
        class: 'comp',
        rx: 10,
        ry: 10,
        data: node,
      });
    });

    var getLookupandmasterobj = {
      lookupObj: [],
      masterObj: [],
      nonConnection: [],
    };
    $(getThisSelector).data('lookupmasterObjData', getLookupandmasterobj);
    var getThiLookupmasterObjData = $(getThisSelector).data(
      'lookupmasterObjData'
    );
    data.offlineObjectDetails.forEach(function (node) {
      var getSource = node.objectName;
      if (node.referenceDetail != undefined) {
        var getThisReference = node.referenceDetail;
        getThisReference.forEach(function (referenceNode) {
          if (referenceNode.referenceType != 'MASTERDETAIL') {
            var dublicateCheck = getThiLookupmasterObjData.lookupObj.filter(
              (getData) =>
                getData.childObjectName === referenceNode.childObjectName
            );
            if (dublicateCheck.length == 0) {
              getThiLookupmasterObjData.lookupObj.push(referenceNode);
            }

            g.setEdge(getSource, referenceNode.childObjectName, {
              label: '',
              arrowhead: 'undirected',
              class: 'Sugumar lookupclass',
              minlen: 1,
              lineInterpolate: 'bundle',
              x: 10,
              y: 10,
            });
          } else {
            var getMasteDetailField = node.fields.filter(
              (getThisField) =>
                getThisField.referenceObjectId === referenceNode.childObjectId
            );
            var referenceTypeClass = '';
            if (getMasteDetailField[0].relationShipType == 'one_to_one') {
              referenceTypeClass = 'onetoonerelation';
            } else if (
              getMasteDetailField[0].relationShipType == 'one_to_many'
            ) {
              referenceTypeClass = 'onetomanyrelation';
            }
            var dublicateChek = getThiLookupmasterObjData.masterObj.filter(
              (getData) =>
                getData.childObjectName === referenceNode.childObjectName
            );
            if (dublicateChek.length == 0) {
              getThiLookupmasterObjData.masterObj.push(referenceNode);
            }

            g.setEdge(referenceNode.childObjectName, getSource, {
              label: '',
              arrowhead: 'undirected',
              class: 'Sugumar masterdetailclass ' + referenceTypeClass,
              minlen: 1,
              lineInterpolate: 'bundle',
              x: 10,
              y: 10,
            });
          }
        });
      }

      if (
        node.referenceDetail == undefined &&
        node.backwardReferenceDetail == undefined
      ) {
        var dublicateChck = getThiLookupmasterObjData.nonConnection.filter(
          (getData) => getData.childObjectName === node.objectName
        );
        if (dublicateChck.length == 0) {
          getThiLookupmasterObjData.nonConnection.push({
            childObjectName: node.objectName,
            referenceType: '',
            childObjectId: node.objectId,
          });
        }
      }
    });
    // Create the renderer
    var render = new dagreD3.render();
    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select('.cs-erdiagram svg'),
      inner = svg.append('g');
    console.log('svg', svg);
    console.log('inner', inner);
    // render(svg, inner)

    // svg.style('background', 'white');

    var zoom = d3.zoom().scaleExtent([0.25 / 2, 8]);
    // Create a zoom behavior
    var zoom = d3.zoom().on('zoom', function (event) {
      inner.attr(
        'transform',
        'translate(' +
          event.transform.x +
          ',' +
          event.transform.y +
          ') scale(' +
          event.transform.k +
          ')'
      );
    });

    // Create the SVG element and attach the zoom behavior
    var vis = svg
      .append('svg')
      .attr('width', g.graph().width)
      .attr('height', g.graph().height)
      .call(zoom);

    svg.call(zoom);
    render(inner, g);
    svg
      .selectAll('g.node rect')
      .attr('id', function (d) {
        return 'node' + d;
      })
      .style('fill', '#22a7f0');
    svg
      .selectAll('g.edgePath path')
      .attr('id', function (e) {
        d3.select(this.parentNode).attr('title', e.w);
        return e.v + '-' + e.w;
      })
      .attr('marker-start', function (e) {
        return 'url(#startmark-' + e.v + '-' + e.w + ')';
      })
      .attr('marker-end', function (e) {
        var returnval;
        if (d3.select(this.parentNode).classed('onetoonerelation')) {
          returnval = 'endmarkonetoone';
        } else if (d3.select(this.parentNode).classed('onetomanyrelation')) {
          returnval = 'endmarkonetomany';
        } else if (d3.select(this.parentNode).classed('lookupclass')) {
          returnval = 'endmarklookup';
        } else {
          returnval = 'endmarkcommon';
        }
        return 'url(#' + returnval + '-' + e.v + '-' + e.w + ')';
      });

    svg
      .selectAll('g.edgePath')
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', function (e) {
        return 'startmark-' + e.v + '-' + e.w;
      })
      .attr('viewBox', '0 0 20 20')
      .attr('refX', 0)
      .attr('refY', 8)
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('svg:circle')
      .attr('cx', 8)
      .attr('cy', 8)
      .attr('r', 8)
      .attr('class', 'cs-markercircle')
      .attr('id', function (e) {
        return e.v + '-' + e.w;
      });

    var onetooneedgepath = svg
      .selectAll('g.edgePath.onetoonerelation')
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', function (e) {
        return 'endmarkonetoone-' + e.v + '-' + e.w;
      })
      .attr('viewBox', '0 0 20 20')
      .attr('refX', 8)
      .attr('refY', 4)
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', 20)
      .attr('markerHeight', 20)
      .attr('orient', 'auto');

    onetooneedgepath
      .append('svg:circle')
      .attr('cx', 3)
      .attr('cy', 4)
      .attr('r', 2)
      .attr('class', 'cs-masterdetailmarkercircle')
      .attr('id', function (e) {
        return e.v + '-' + e.w;
      });

    var onetomanyedgepath = svg
      .selectAll('g.edgePath.onetomanyrelation')
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', function (e) {
        return 'endmarkonetomany-' + e.v + '-' + e.w;
      })
      .attr('viewBox', '0 0 20 20')
      .attr('refX', 8)
      .attr('refY', 4)
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', 20)
      .attr('markerHeight', 20)
      .attr('orient', 'auto');

    onetomanyedgepath
      .append('svg:path')
      .attr('d', 'M8,0 L1,4 L6,4 L1,4 L8,8')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '1,0')
      .attr('class', 'cs-markerpath cs-onetomanypath')
      .attr('id', function (e) {
        return e.v + '-' + e.w;
      });
    onetomanyedgepath
      .append('svg:circle')
      .attr('cx', 2)
      .attr('cy', 4)
      .attr('r', 1.5)
      .attr('class', 'cs-masterdetailmarkercircle')
      .attr('id', function (e) {
        return e.v + '-' + e.w;
      });

    var lookupobjedgepath = svg
      .selectAll('g.edgePath.lookupclass')
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', function (e) {
        return 'endmarklookup-' + e.v + '-' + e.w;
      })
      .attr('viewBox', '0 0 20 20')
      .attr('refX', 8)
      .attr('refY', 4)
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', 20)
      .attr('markerHeight', 20)
      .attr('orient', 'auto');

    lookupobjedgepath
      .append('svg:path')
      .attr('d', 'M8,0 L1,4 L6,4 L1,4 L8,8')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '1,0')
      .attr('class', 'cs-markercircle cs-lookupendpath')
      .attr('id', function (e) {
        return e.v + '-' + e.w;
      });

    lookupobjedgepath
      .append('svg:circle')
      .attr('cx', 2)
      .attr('cy', 4)
      .attr('r', 1.5)
      .attr('class', 'cs-lookupmarkercircle')
      .attr('id', function (e) {
        return e.v + '-' + e.w;
      });
    console.log('inner', lookupobjedgepath);

    // Lookup
    svg
      .selectAll('g.edgePath.lookupclass marker circle')
      .style('fill', '#22a7f0');
    svg
      .selectAll('g.edgePath.lookupclass path')
      .style('fill', 'none')
      .style('stroke-dasharray', 5)
      .style('stroke-width', '2px')
      .style('stroke', '#9a9a9a');
    svg
      .selectAll('g.edgePath.lookupclass marker path')
      .style('fill', '#BAB3FF')
      .style('stroke-dasharray', 0);
    svg
      .selectAll('g.edgePath.lookupclass path.cs-lookupendpath')
      .style('fill', 'none')
      .style('stroke', '#22a7f0')
      .style('stroke-width', '1px');
    svg
      .selectAll('g.edgePath.lookupclass marker circle.cs-lookupmarkercircle')
      .style('fill', '#fff')
      .style('stroke', '#22a7f0')
      .style('stroke-width', '1px');

    // One to One Green
    svg
      .selectAll('g.edgePath.onetoonerelation path')
      .style('fill', 'none')
      .style('stroke', '#26a65b')
      .style('stroke-width', '2px')
      .style('stroke-dasharray', 5);
    svg
      .selectAll('g.edgePath.onetoonerelation marker circle')
      .style('fill', '#26a65b');
    svg
      .selectAll('g.edgePath.onetoonerelation marker path')
      .style('fill', '#26a65b')
      .style('stroke-dasharray', 0);
    svg
      .selectAll(
        'g.edgePath.onetoonerelation marker circle.cs-masterdetailmarkercircle'
      )
      .style('fill', '#FFF')
      .style('stroke', '#26a65b')
      .style('stroke-width', '1px');

    // One To Many Green
    svg
      .selectAll('g.edgePath.onetomanyrelation path')
      .style('fill', 'none')
      .style('stroke', '#26a65b')
      .style('stroke-dasharray', 5)
      .style('stroke-width', '2px');
    svg
      .selectAll('g.edgePath.onetomanyrelation marker circle')
      .style('fill', '#26a65b');
    svg
      .selectAll('g.edgePath.onetomanyrelation marker path')
      .style('fill', '#26a65b')
      .style('stroke-dasharray', 0);
    svg
      .selectAll('g.edgePath.onetomanyrelation path.cs-onetomanypath')
      .style('fill', 'none')
      .style('stroke', '#26a65b')
      .style('stroke-width', '1px');
    svg
      .selectAll(
        'g.edgePath.onetomanyrelation marker circle.cs-masterdetailmarkercircle'
      )
      .style('fill', '#FFF')
      .style('stroke', '#26a65b')
      .style('stroke-width', '1px');

    svg.selectAll('g.edgeLabel g').attr('id', function (e) {
      return 'label_' + e.v + '-' + e.w;
    });

    g.nodes().forEach(function (v) {
      var node = g.node(v);
      node.customId = 'node' + v;
    });

    g.edges().forEach(function (e) {
      var edge = g.edge(e.v, e.w);
      edge.customId = e.v + '-' + e.w;
      $('#' + edge.customId).attr('d', calcPoints(e));
    });

    g.nodes().forEach(function (v) {
      var node = g.node(v);
    });
    d3.select('.cs-erdiagram svg')
      .selectAll('g.node')
      .call(d3.drag().on('start', dragstart).on('drag', dragmove));
    // var nodeDrag = d3.drag().on('dragstart', dragstart).on('drag', dragmove);
    // d3.select('g.node').call(nodeDrag);
    var edgeDrag = d3
      .drag()
      .on('dragstart', dragstart)
      .on('drag', function (d) {
        translateEdge(g.edge(d.v, d.w, ''), d3.event.dx, d3.event.dy);
        $('#' + g.edge(d.v, d.w, '').customId).attr('d', calcPoints(d));
      });
    d3.select('g.edgePath').call(edgeDrag);

    $('#svgcontainer g').eq(0).attr('id', 'firstgroupid');

    $(document).on('click', '.cs-infoclick', function (e) {
      e.stopPropagation();
      $('.cs-dropdownfilter').css('display', 'none');
      if ($(this).find('.cs-infodrop').css('display') == 'none') {
        $(this).find('.cs-infodrop').css('display', 'block');
      } else {
        $(this).find('.cs-infodrop').css('display', 'none');
      }
    });
    $(document).on('click', function (e) {
      $('.cs-dropdownfilter').css('display', 'none');
      $('.cs-infodrop').css('display', 'none');
    });

    $(document).on('click', '.cs-filterclick', function (e) {
      e.stopPropagation();
      $('.cs-infodrop').css('display', 'none');
      if ($(this).find('.cs-dropdownfilter').css('display') == 'none') {
        $(this).find('.cs-dropdownfilter').css('display', 'block');
      } else {
        $(this).find('.cs-dropdownfilter').css('display', 'none');
      }
    });

    function dragstart(d) {
      d.sourceEvent.stopPropagation();
    }

    function dragmove(event, d) {
      var node = d3.select(this);
      var selectedNode = g.node(d); // Assuming that `g.node(d)` gives you a reference to your data.
      var prevX = selectedNode.x;
      var prevY = selectedNode.y;

      selectedNode.x += event.dx;
      selectedNode.y += event.dy;
      node.attr('transform', `translate(${selectedNode.x},${selectedNode.y})`);

      var dx = selectedNode.x - prevX;
      var dy = selectedNode.y - prevY;

      g.edges().forEach(function (e) {
        if (e.v === d || e.w === d) {
          var edge = g.edge(e.v, e.w);
          translateEdge(g.edge(e.v, e.w), dx, dy);
          d3.select(`#${edge.customId}`).attr('d', calcPoints(e));
          var label = d3.select(`#label_${edge.customId}`);
          var xforms = label.attr('transform');
          if (xforms !== null) {
            var parts = /translate\(\s*([^\s,)]+)[ ,]?([^\s,)]+)?/.exec(xforms);
            var X = parseInt(parts[1]) + dx;
            var Y = parseInt(parts[2]) + dy;
            if (isNaN(Y)) {
              Y = dy;
            }
            label.attr('transform', `translate(${X},${Y})`);
          }
        }
      });
    }

    function translateEdge(e, dx, dy) {
      e.points.forEach(function (p) {
        p.x = p.x + dx;
        p.y = p.y + dy;
      });
    }

    //taken from dagre-d3 source code (not the exact same)
    function calcPoints(e) {
      var edge = g.edge(e.v, e.w),
        tail = g.node(e.v),
        head = g.node(e.w);
      var points = edge.points.slice(1, edge.points.length - 1);
      var afterslice = edge.points.slice(1, edge.points.length - 1);
      points.unshift(intersectRect(tail, points[0]));
      points.push(intersectRect(head, points[points.length - 1]));
      const lineGenerator = d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y - 3)
        .curve(d3.curveBasis);

      const pathData = lineGenerator(points);
      return pathData;
    }
    function convertStringToCharEntity(param) {
      return $('<div/>')
        .text(param)
        .html()
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
    //taken from dagre-d3 source code (not the exact same)
    function intersectRect(node, point) {
      var x = node.x;
      var y = node.y;
      var dx = point.x - x;
      var dy = point.y - y;
      var w = $('#' + node.customId).attr('width') / 2;
      var h = $('#' + node.customId).attr('height') / 2;
      var sx = 0,
        sy = 0;
      if (Math.abs(dy) * w > Math.abs(dx) * h) {
        // Intersection is top or bottom of rect.
        if (dy < 0) {
          h = -h;
        }
        sx = dy === 0 ? 0 : (h * dx) / dy;
        sy = h;
      } else {
        // Intersection is left or right of rect.
        if (dx < 0) {
          w = -w;
        }
        sx = w;
        sy = dx === 0 ? 0 : (w * dy) / dx;
      }
      return {
        x: x + sx,
        y: y + sy,
      };
    }

    setTimeout(function () {
      var thiserselector = $(getThisSelector).find('.cs-erdiagram');
      // var thiscloneselector = $(getThisSelector).find('.erdiagramcloneblock');
      // console.log('thiscloneselector', thiscloneselector);
      var svgClone = thiserselector.html();
      $('#firstgroupid').attr(
        'transform',
        'translate(84.2825411250742,54.394029264872586)scale(0.5)'
      );
      // thiscloneselector.append(svgClone);
    }, 600);
  }
}
