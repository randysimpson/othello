import React from 'react';
import {
  Link
} from "react-router-dom";

const DataGridRow = (props) => {
  const { item } = props;
  return (
    <clr-dg-row _ngcontent-clarity-c108="" role="rowgroup" class="datagrid-row ng-star-inserted" aria-owns="clr-dg-row21">
      <div class="datagrid-row-master datagrid-row-flex ng-star-inserted" role="row">
        <div class="datagrid-row-sticky"></div>
        <div class="datagrid-row-scrollable">
          <div class="datagrid-scrolling-cells">
            {item && item.columns && item.columns.map((column) => (
              <clr-dg-cell _ngcontent-clarity-c108="" role="gridcell" class="datagrid-cell ng-star-inserted" style={{width: column.width}} key={column.id}>
                {column.href && (
                  <Link to={column.href}>{column.data}</Link>
                )}
                {!column.href && (
                  column.data
                )}
              </clr-dg-cell>
            ))}
          </div>
        </div>
      </div>
    </clr-dg-row>
  );
};

export default DataGridRow;
