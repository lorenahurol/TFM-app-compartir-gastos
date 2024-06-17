import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { CommonFunctionsService } from '../../common/utils/common-functions.service';
import { AlertModalService } from '../../services/alert-modal.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertModalComponent, IAlertData } from '../alert-modal/alert-modal.component';

@Component({
  selector: 'app-change-pwd-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-pwd-modal.component.html',
  styleUrl: './change-pwd-modal.component.css',
})
export class ChangePwdModalComponent {
  alertModalService = inject(AlertModalService);
  alertModal: MatDialogRef<AlertModalComponent, any> | undefined;

  usersServices = inject(UsersService);
  authServices = inject(AuthService);
  commonFunc = inject(CommonFunctionsService);

  passwordForm: FormGroup;

  usernameExists: { exists: boolean } = { exists: false };

  isUpdate: boolean = false;
  username: string = '';
  id: number = 0;

  constructor() {
    this.passwordForm = new FormGroup(
      {
        password: new FormControl(null, [Validators.required]),
        password_confirm: new FormControl(null, [Validators.required]),
      },
      [this.commonFunc.passwordControl]
    );
  }

  // Instancia el modal alert-modal-component para alertas
  openAlertModal(modalData: IAlertData): void {
    this.alertModal = this.alertModalService.open(modalData);
  }

  checkControl(
    formControlName: string,
    validatorName: string
  ): boolean | undefined {
    return (
      this.passwordForm.get(formControlName)?.hasError(validatorName) &&
      this.passwordForm.get(formControlName)?.touched
    );
  }

  async UpdatePassword() {
    const password = { password: this.passwordForm.value.password };
    const pwdResponse = await this.usersServices.updatePassword(password);
    if (pwdResponse.success) {
      this.openAlertModal({
        icon: 'done_all',
        title: 'Genial!',
        body: 'Contraseña actualizada correctamente ',
        acceptAction: true,
        backAction: false,
      });
    } else {
      this.openAlertModal({
        icon: 'warning',
        title: 'Atención!',
        body: 'Se ha verificado un error durante la actualización',
        acceptAction: true,
        backAction: false,
      });
    }
  }
}