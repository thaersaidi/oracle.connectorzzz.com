import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  public post: any;
  public resume: any;
  public email: any;
  public name_abr: string;
  public mainEmail: string = environment.mainEmail;
  public isBotMessage: boolean = false;

  public menuItems = [
    { key: 'skills', label: 'Skills' }
  ];

  public filteredMenuItems: any[] = [];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const email = params.get('email');

      if (email) {
        this.email = email;
        this.dataService.fetchDataByEmail(email).subscribe(data => {
          this.processData(data);
          this.name_abr = this.resume.firstName.charAt(0) + this.resume.lastName.charAt(0);
        });
      } else {
        this.dataService.fetchData().subscribe(data => {
          this.processData(data);
        });
      }
    });
  }

  private processData(data: any): void {
    this.resume = data.resume;
    this.filteredMenuItems = this.menuItems.filter(item => data[item.key] && data[item.key].length > 0);

    if (data.bots && data.bots.some(bot => bot.type === 'messages')) {
      this.isBotMessage = true;
    }
  }

  changeToMenu(menu: string): void {
    this.post = menu;
  }


}
