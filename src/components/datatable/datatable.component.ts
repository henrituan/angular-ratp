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
          resp['records'].map( (item, idx) => {
            this.data[this.currentIdx] = {
              label: item.fields.tco_libelle,
              postalCode: item.fields.code_postal,
              city: item.fields.ville,
            }
            this.currentIdx += 1;
          });
          this.dataSource = new MatTableDataSource<CommercialPlaceInterface>(this.data);
          this.dataSource.paginator = this.paginator;
        },
        err => {
          console.log(err);
        }
      ); // end subscribe
    } // end OnInint

    pageOnChange(event) {
      this.currentIdx = event.pageIndex * this.pageSize + 1;
      this.loadData(this.currentIdx);
    } // end pageOnChange

    searchTextOnChange(text) {
      console.log(text);
      this.searchSub = this.apiService.get('/search', {...getAllParams, q: text} ).subscribe(
        resp => {
          this.data = new Array<CommercialPlaceInterface>(resp['nhits']); // init array with size of full results
          this.paginator.firstPage();
          this.currentIdx = 0;
          resp['records'].map( (item, idx) => {
            this.data[this.currentIdx] = {
              label: item.fields.tco_libelle,
              postalCode: item.fields.code_postal,
              city: item.fields.ville,
            }
            this.currentIdx += 1;
          });
          this.dataSource = new MatTableDataSource<CommercialPlaceInterface>(this.data);
          this.dataSource.paginator = this.paginator;
        },
        err => {
          console.log(err);
        }
      );
    } // end searchTextOnChange

    ngOnDestroy() {
      this.getAllSub.unsubscribe();
    }

    loadData(startIdx) {
       this.getAllSub = this.apiService.get('/search', {...getAllParams, start: startIdx}).subscribe(
        resp => {
          resp['records'].map( (item, idx) => {
            this.data[this.currentIdx] = {
              label: item.fields.tco_libelle,
              postalCode: item.fields.code_postal,
              city: item.fields.ville,
            }
            this.currentIdx += 1;
          });
          this.dataSource = new MatTableDataSource<CommercialPlaceInterface>(this.data);
          this.dataSource.paginator = this.paginator;
        },
        err => {
          console.log(err);
        }
      ); // end subscribe
    }

}
