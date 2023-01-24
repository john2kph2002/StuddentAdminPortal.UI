import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
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
  }

  genderList: Gender[] = [];

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackbar: MatSnackBar){ }


  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) =>{
        this.studentId = params.get('id');

        if(this.studentId){
          this.studentService.getStudent(this.studentId)
          .subscribe(
            (successResponse) => {
              this.student = successResponse;
              //console.log(successResponse);
            }
          );

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
    //console.log(this.student);
    this.studentService.updateStudent(this.student.id, this.student)
    .subscribe(
      (successResponse) => {
        //Show notification
        this.snackbar.open('Student updated successfuly', undefined, {
          duration:2000
        });

      },
      (errorResponse) =>{
        // Log it
      }
    )
  }
}
