import { PageToCrawl } from './PageToCrawl';
import { Http, Response } from '@angular/http';
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<h1>Connectors Marketplace {{name}}</h1>
            <div>
             <input type="file" (change)="onChange($event)"/>
            </div>
            <div>
              <table border="1" class="demoTable">
                <tr *ngFor="let x of pagesToCrawl">
                  <td>{{ x.Url }}</td>
                </tr>
              </table>
            </div>
            `
})
export class AppComponent 
{ 
  pagesToCrawl : PageToCrawl[] = [];
  
  constructor (private http: Http) {}

  onChange(event) {
        var text = [];
        var files = event.srcElement.files;
        if(files[0].name.includes(".csv"))
        {
           var input = event.target;
           var reader = new FileReader();
         
           reader.onload = function(){
             let csvData = reader.result;
             let allTextLines = csvData.split(/\r\n|\n/);
             let headers = allTextLines[0].split(';');
             let lines = [];
             
             for (let i = 0; i < allTextLines.length; i++) {
              // split content based on comma
              let data = allTextLines[i].split(';');
              if (data.length == headers.length) {
                let tarr = [];
                for (let j = 0; j < headers.length; j++) {
                  tarr.push(data[j]);
                }
                var page = new PageToCrawl();
                page.Url = "https://www.google.ie/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#safe=active&q=" + tarr[0] + "+" + tarr[1] + "+" + tarr[2];
                text.push(page);
              }
            }
          };
          reader.readAsText(input.files[0]);
          this.pagesToCrawl = text;
          console.log(this.pagesToCrawl);
          this.http.post("localhost:5000/setData", text)
      }
    }

    
}
