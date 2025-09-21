import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MetadataComponent } from './components/metadata/metadata.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpclientService } from './services/httpclient.service';

@NgModule({
  declarations: [
    AppComponent,
    MetadataComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'always' })
  ],
  providers: [HttpclientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
