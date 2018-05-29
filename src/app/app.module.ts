// core
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// material
import { MatInputModule,
         MatPaginatorModule,
         MatProgressSpinnerModule,
         MatSortModule,
         MatTableModule,
         MatFormFieldModule,
         MatButtonModule,
        } from '@angular/material';

// components
import { AppComponent } from './app.component';
// custom component
import { DatatableComponent } from '../components/components.config';

@NgModule({
  declarations: [
    AppComponent,
    DatatableComponent,
  ],
  imports: [
    // core
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent, DatatableComponent],
})
export class AppModule { }
