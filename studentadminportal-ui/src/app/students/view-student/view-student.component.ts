import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/gender.models';
import { GenderService } from 'src/app/services/gender.service';
import { Student } from '../../models/ui-models/student.models';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    profileImageUrl: '',
    genderId: '',  
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  };

  isNewStudent = false;
  header = '';
  displayProfileImageUrl = '';
  genderList: Gender[] = [];

  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackbar: MatSnackBar,
    private router: Router){ }


  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) =>{
        this.studentId = params.get('id');

        if(this.studentId){          
          if(this.studentId.toLowerCase() === 'Add'.toLowerCase()){
           this.isNewStudent = true;
           this.header = 'Add New Student';
           this.setImage();
          }else{
            this.isNewStudent = false;
            this.header = 'Edit Student';
            this.studentService.getStudent(this.studentId)
            .subscribe(
              (successResponse) => {
                this.student = successResponse;
                //console.log(successResponse);
                this.setImage();
              },
              (errorResponse) =>{
                this.setImage();
              }
            );
          }        

          this.genderService.getGenderList()
          .subscribe(
            (successResponse) =>{
              this.genderList = successResponse;
            }
          );
        }
      }
    );
  }

  onUpdate(): void{
    if(this.studentDetailsForm?.form.valid){
      this.studentService.updateStudent(this.student.id, this.student)
      .subscribe(
        (successResponse) => {
          //Show notification
          this.snackbar.open('Student updated successfuly', undefined, {
            duration:2000
          });
  
        },
        (errorResponse) =>{
          console.log(errorResponse)  
        }
      )
    }
    //console.log(this.student)  
  }

  onDelete(): void{
    this.studentService.deleteStudent(this.student.id)
    .subscribe(
      (successResponse) =>{
        this.snackbar.open('Student deleted successfuly', undefined,{
          duration: 2000
        });
        
        setTimeout(()=>{
          this.router.navigateByUrl('students');
        }, 2000);
        
      },
      (errorResponse) =>{
        //log
      }
    );
  }

  onAdd(): void{
    if(this.studentDetailsForm?.form.valid){
      this.studentService.addStudent(this.student)
      .subscribe(
        (successResponse) => {
          this.snackbar.open('Student added successfuly', undefined,{
            duration: 2000
          });
          setTimeout(()=>{
            this.router.navigateByUrl(`students/${successResponse.id}`);
          }, 2000);
        },
        (errorResponse) =>{
          //log
          console.log(errorResponse);
        }
      );
    }  
  }

  uploadImage(event: any): void{
    if(this.studentId){
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file)
      .subscribe(
        (successResponse) =>{
          this.student.profileImageUrl = successResponse;
          this.setImage();

          //Show a notification
          this.snackbar.open('Profile Image Updated', undefined, {
            duration: 2000
          });

        },
        (errorResponse)=>{
          this.setImage();

        }
      );
    }
  }

  private setImage(): void{
    if(this.student.profileImageUrl){
      this.displayProfileImageUrl = this.studentService.getImagePath(this.student.profileImageUrl);
    }
    else{
      //Display a default
      this.displayProfileImageUrl = '/assets/defaultImage.png'
    }
  }
}
