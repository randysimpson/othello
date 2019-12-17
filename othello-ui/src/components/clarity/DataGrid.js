import React from 'react';
import DataGridRow from './DataGridRow';

const DataGrid = ({columns, data, total, currentPage, numOnPage, firstPageClick, prevPageClick, nextPageClick, lastPageClick, textPageChange, changeNumOnPage}) => {
  return (
    <clr-datagrid _ngcontent-clarity-c108="" className="datagrid-host" style={{height: '468px'}}>
      <div className="datagrid">
        <div className="datagrid-table-wrapper">
          <div class="datagrid-table" role="grid" tabIndex="-1">
            <div class="datagrid-header" role="rowgroup">
              <div class="datagrid-row" role="row">
                <div class="datagrid-row-master datagrid-row-flex">
                  <div class="datagrid-row-sticky"></div>
                  <div class="datagrid-row-scrollable">
                    {columns.map((column) => (
                      <clr-dg-column _ngcontent-clarity-c108="" role="columnheader" class="datagrid-column ng-star-inserted" aria-sort="none" style={{width: column.width}} key={column.id}>
                        <div class="datagrid-column-flex">
                          <span class="datagrid-column-title ng-star-inserted">{column.title}</span>
                          <clr-dg-column-separator class="datagrid-column-separator">
                            <div aria-hidden="true" class="datagrid-column-handle drag-handle draggable" clrdraggable=""></div>
                            <div class="datagrid-column-resize-tracker"></div>
                          </clr-dg-column-separator>
                        </div>
                      </clr-dg-column>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {data.map(item => (
              <DataGridRow
                key={item.id}
                item={item} />
            ))}
            <clr-dg-placeholder class="datagrid-placeholder-container ng-star-inserted">
              <div class="datagrid-placeholder"></div>
            </clr-dg-placeholder>
          </div>
        </div>
      </div>
      {currentPage && <clr-dg-footer _ngcontent-clarity-c108="" class="datagrid-footer">
        <div class="datagrid-footer-description"></div>
        <clr-dg-pagination _ngcontent-clarity-c108="" class="pagination">
          <div class="pagination-size ng-star-inserted">
            <clr-dg-page-size _ngcontent-clarity-c108="">Users per page
              <div class="clr-select-wrapper">
                <select class="clr-page-size-select ng-untouched ng-pristine ng-valid" value={numOnPage} onChange={changeNumOnPage}>
                  <option value="10" class="ng-star-inserted">10</option>
                  <option value="20" class="ng-star-inserted">20</option>
                  <option value="50" class="ng-star-inserted">50</option>
                  <option value="100" class="ng-star-inserted">100</option>
                </select>
              </div>
            </clr-dg-page-size>
          </div>
          <div class="pagination-description"> {(currentPage - 1) * numOnPage + 1} - {(currentPage) * numOnPage < total ? (currentPage) * numOnPage : total} of {total} tasks </div>
          <div class="pagination-list ng-star-inserted">
            <button class="pagination-first" type="button" disabled="" aria-label="First Page" onClick={firstPageClick}>
              <clr-icon shape="step-forward-2 down" role="none">
                <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" focusable="false" role="img">
                  <path d="M7.08,6.52a1.68,1.68,0,0,0,0,2.4L16.51,18,7.12,27.08a1.7,1.7,0,0,0,2.36,2.44h0L21.4,18,9.48,6.47A1.69,1.69,0,0,0,7.08,6.52Z" class="clr-i-outline clr-i-outline-path-1"></path>
                  <path d="M26.49,5a1.7,1.7,0,0,0-1.7,1.7V29.3a1.7,1.7,0,0,0,3.4,0V6.7A1.7,1.7,0,0,0,26.49,5Z" class="clr-i-outline clr-i-outline-path-2"></path>
                </svg>
              </clr-icon>
            </button>
            <button class="pagination-previous" type="button" disabled="" aria-label="Previous Page" onClick={prevPageClick}>
              <clr-icon shape="angle left" role="none">
                <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" focusable="false" role="img">
                  <path class="clr-i-outline clr-i-outline-path-1" d="M29.52,22.52,18,10.6,6.48,22.52a1.7,1.7,0,0,0,2.45,2.36L18,15.49l9.08,9.39a1.7,1.7,0,0,0,2.45-2.36Z"></path>
                </svg>
              </clr-icon>
            </button>
            <input class="pagination-current clr-input" type="text" size="2" aria-label="Current Page" value={currentPage} onChange={textPageChange}/> &nbsp;/&nbsp;
            <span aria-label="Total Pages">{total % numOnPage === 0 ? Math.floor(total / numOnPage) : Math.floor(total / numOnPage) + 1}</span>
            <button class="pagination-next" type="button" aria-label="Next Page" onClick={nextPageClick}>
              <clr-icon shape="angle right" role="none">
                <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" focusable="false" role="img">
                  <path class="clr-i-outline clr-i-outline-path-1" d="M29.52,22.52,18,10.6,6.48,22.52a1.7,1.7,0,0,0,2.45,2.36L18,15.49l9.08,9.39a1.7,1.7,0,0,0,2.45-2.36Z"></path>
                </svg>
              </clr-icon>
            </button>
            <button class="pagination-last" type="button" aria-label="Last Page" onClick={lastPageClick}>
              <clr-icon shape="step-forward-2 up" role="none">
                <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" focusable="false" role="img">
                  <path d="M7.08,6.52a1.68,1.68,0,0,0,0,2.4L16.51,18,7.12,27.08a1.7,1.7,0,0,0,2.36,2.44h0L21.4,18,9.48,6.47A1.69,1.69,0,0,0,7.08,6.52Z" class="clr-i-outline clr-i-outline-path-1"></path>
                  <path d="M26.49,5a1.7,1.7,0,0,0-1.7,1.7V29.3a1.7,1.7,0,0,0,3.4,0V6.7A1.7,1.7,0,0,0,26.49,5Z" class="clr-i-outline clr-i-outline-path-2"></path>
                </svg>
              </clr-icon>
            </button>
          </div>
        </clr-dg-pagination>
      </clr-dg-footer> }
      <div class="datagrid-calculation-table">
        <div class="datagrid-calculation-header"></div>
      </div>
    </clr-datagrid>
  );
};

export default DataGrid;
