import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { OpiniatedCommonModule } from '../common/index';
import { CommonModule } from '@angular/common';
import { CountryService } from './country.service';
import { PhoneNumberComponent, PHONE_VALIDATOR, PhoneValidator } from './phone';
import { CountryPipe } from './country.pipe';

const Components = [
    PhoneNumberComponent
];

@NgModule({
  declarations: [
      ...Components
      ,  CountryPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    OpiniatedCommonModule.forChild()
  ],
  providers: [CountryService],
  exports: [
      ...Components
    ],
  entryComponents: [...Components]
})
export class OpiniatedPhoneModule {

  public static forRoot(options: {validator: PhoneValidator}): ModuleWithProviders<OpiniatedPhoneModule> {
    return {
        ngModule: OpiniatedPhoneModule,
        providers: [
            {
                provide: PHONE_VALIDATOR,
                useValue: options.validator,
            },
        ]
    };
}
}
