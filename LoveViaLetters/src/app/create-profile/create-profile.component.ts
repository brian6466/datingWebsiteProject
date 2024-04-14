import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserFirebaseService} from "../shared/userFirebase.service";

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css'
})
export class CreateProfileComponent implements OnInit {

  profileForm: FormGroup = new FormGroup({});
  interests = ['Hiking', 'Cooking', 'Gaming', 'Traveling', 'Reading'];
  selectedInterests: string[] = [];

  constructor(private router: Router, private userFirebaseService: UserFirebaseService, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      profilePicture: [''],
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      gender: ['', Validators.required],
      height: [''],
      description: [''],
      smoke: [false],
      drink: [false],
      selectedInterests: [[]],
      lookingFor: ['']
    });

    this.interests.forEach(interest => {
      this.profileForm.addControl(interest, new FormControl(false));
    });
  }

  toggleInterest(interest: string): void {
    if (this.isSelected(interest)) {
      this.selectedInterests = this.selectedInterests.filter(item => item !== interest);
    } else {
      this.selectedInterests.push(interest);
    }
    this.profileForm.patchValue({ selectedInterests: this.selectedInterests });
  }

  isSelected(interest: string): boolean {
    return this.selectedInterests.includes(interest);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.profileForm.patchValue({ profilePicture: file });  // Update form control with file
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.userFirebaseService.createProfileFromForm(this.profileForm.value)
      console.log(this.profileForm.value);
    } else {
      console.error('Inputted data failed our validation check...')
    }
  }


}
