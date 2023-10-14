import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forbiddenNameValidator } from './forbidden-name.directive';
import { Router } from '@angular/router';
import {TuiDay} from '@taiga-ui/cdk';
import ApiService from '../../shared/services/api.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  constructor(private router: Router) {
  }
  
  search = { cityFrom: 'Zürich', cityTo: 'Frankfurt', departureDate: TuiDay.currentLocal(), trains: false };
  min = TuiDay.currentLocal();

  searchForm!: FormGroup;

  ngOnInit(): void {
    this.searchForm = new FormGroup(
      {
        cityFrom: new FormControl(this.search.cityFrom, [
          Validators.required,
          Validators.minLength(3),
          forbiddenNameValidator(/XYZ/i),
        ]),
        cityTo: new FormControl(this.search.cityTo, [
          Validators.required,
          Validators.minLength(3),
          forbiddenNameValidator(/XYZ/i),
        ]),
        departureDate: new FormControl(this.search.departureDate, [
          Validators.required,
          //Validators.pattern(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
        ]),
        trains: new FormControl(this.search.trains, [
          Validators.required
        ]),
      },
    ); // <-- add custom validator at the FormGroup level
  }

  async loadData() {
    const cityFrom = await ApiService.getLocationId(this.cityFrom.value)
    const cityTo = await ApiService.getLocationId(this.cityTo.value)
    const departureDate = this.departureDate.value.toString().replace(/\./g, '/');
    const trains = this.trains.value;
    this.router.navigate(
      ['/results'],
      {
        queryParams: {
          cityFrom: cityFrom,
          cityTo: cityTo,
          departureDate: departureDate,
          trains: trains
        },
      }
    );
  }

  get cityFrom() {
    return this.searchForm.get('cityFrom')!;
  }
  get cityTo() {
    return this.searchForm.get('cityTo')!;
  }
  get departureDate() {
    return this.searchForm.get('departureDate')!;
  }
  get trains() {
    return this.searchForm.get('trains')!;
  }
}

