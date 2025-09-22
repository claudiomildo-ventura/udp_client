import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ArchetypeComponent } from './components/archetype/archetype.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpclientService } from './services/httpclient.service';

@NgModule({
  declarations: [
    AppComponent,
    ArchetypeComponent
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
