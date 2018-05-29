// core
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    ViewChild,
    // AfterViewInit,
    // HostListener
} from '@angular/core';
// material
import { MatPaginator, MatTableDataSource } from '@angular/material';
// services
import { ApiService } from '../../services/services.config';

const dataset = 'liste-des-commerces-de-proximite-agrees-ratp';
const pageSize = 10;
const getAllParams = {
  dataset: dataset,
  sort: 'code_postal',
  facet: 'tco_libelle',
  rows: pageSize * 3,
}

interface CommercialPlaceInterface {
  label: string;
  city: number;
  postalCode: number;
}

@Component({
    selector: 'datatable-component',
    templateUrl: 'datatable.component.html',
    providers: [ApiService]
})
export class DatatableComponent implements OnInit {

    constructor(
        private apiService: ApiService
    ) { } // end constructor

    displayedColumns = ['label', 'city', 'postalCode'];
    dataSource: any;
    data: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    pageSize: number = pageSize;
    currentIdx: number = 0;

    private getAllSub: any;
    private searchSub: any;

    ngOnInit() {
      this.getAllSub = this.apiService.get('/search', {...getAllParams, start: 0}).subscribe(
        resp => {
          this.data = new Array<CommercialPlaceInterface>(resp['nhits']); // init array with size of full results
          this.mapData(resp['records']);
        },
        err => {
          console.log(err);
        }
      ); // end subscribe
    } // end OnInint

    pageOnChange(event) {
      this.currentIdx = event.pageIndex * this.pageSize + 1;
      this.getAllSub = this.apiService.get('/search', {...getAllParams, start: this.currentIdx}).subscribe(
        resp => {
          this.mapData(resp['records']);
        },
        err => {
          console.log(err);
        }
      ); // end subscribe
    } // end pageOnChange

    searchTextOnChange(text) {
      this.searchSub = this.apiService.get('/search', {...getAllParams, q: text} ).subscribe(
        resp => {
          this.data = new Array<CommercialPlaceInterface>(resp['nhits']); // init new array with size of full search results
          this.paginator.firstPage(); // return to first page
          this.currentIdx = 0;
          this.mapData(resp['records']);
        },
        err => {
          console.log(err);
        }
      );
    } // end searchTextOnChange

    sortOnChange(event) {

      const firstIdx = this.paginator.pageIndex*this.paginator.pageSize;
      const lastIdx = firstIdx+10;

       //  get data currently displaying on table; reserve left part and right part of this.data
      const leftDataArr: CommercialPlaceInterface[] = this.data.slice(0, firstIdx);
      const displayedData: CommercialPlaceInterface[] = this.data.slice(firstIdx, lastIdx);
      const rightDataArr: CommercialPlaceInterface[] = this.data.slice(lastIdx, this.data.length);

      // now sort the displayed data
      const isAsc = event.direction === 'asc';
      displayedData.sort((a: CommercialPlaceInterface, b: CommercialPlaceInterface) => {
         switch (event.active) {
           case 'label':
             return this.compare(a.label, b.label, isAsc);
           case 'city':
             return this.compare(a.city, b.city, isAsc);
           case 'postalCode':
             return this.compare(a.postalCode, b.postalCode, isAsc);
           default:
             return 0;
         }
      });
      // concat the 3 data parts and update to matTable
      this.data = [...leftDataArr, ...displayedData, ...rightDataArr];
      this.dataSource = new MatTableDataSource<CommercialPlaceInterface>(this.data);
      this.dataSource.paginator = this.paginator;
    }

    compare(a, b, isAsc) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    mapData(jsonRslt) {
      jsonRslt.map( (item, idx) => {
        this.data[this.currentIdx] = {
          label: item.fields.tco_libelle,
          postalCode: item.fields.code_postal,
          city: item.fields.ville,
        }
        this.currentIdx += 1;
      });
      this.dataSource = new MatTableDataSource<CommercialPlaceInterface>(this.data);
      this.dataSource.paginator = this.paginator;
    } // end mapdata

    ngOnDestroy() {
      this.getAllSub.unsubscribe();
    }


}
