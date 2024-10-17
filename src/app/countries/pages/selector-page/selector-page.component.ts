import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'countries-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChange(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.myForm.get('border')!.setValue('')),
        tap(() => this.borders = []),
        switchMap((region) => this.countriesService.getCountriesByRegion(region as Region))
      )
      .subscribe((region) => {
        this.countriesByRegion = region;
      });
  }

  onCountryChange(): void {
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter((country) => !!country),
        switchMap((alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode)),
        switchMap((country) => this.countriesService.getCountryBordersByCode(country.borders))
      )
      .subscribe((borders) => {
        console.log(borders);
        this.borders = borders;
      });
  }

  onSubmit() {

  }

}
