import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MultifilesService } from 'app/services/multifiles.service';
import { AlertComponent } from 'app/alert/alert-component';
import { AlertService } from 'app/shared/alert';
import { MatDialog } from '@angular/material';



@Component({
    selector: 'app-image-item-form',
    templateUrl: './image-item-form.component.html',
    styleUrls: ['./image-item-form.component.css'],
})
export class ImageComponent implements OnInit {
    public documentGrp: FormGroup;
    public totalfiles: Array<File> = [];
    public totalFileName = [];
    public imageFilter = 'image/jpeg, .jpeg, .jfif, image/png, .png, image/pjpeg, .jpg';
    public soundFilter = 'audio/mp3,audio/*, audio/x-m4a,audio/*';
    public videoFilters = 'video/mp4,video/x-m4v,video/*';
    public fileFilter = '';
    public selectedIcon = '';
    public lengthCheckToaddMore = 0;
    constructor(private formBuilder: FormBuilder,
        private multifilesService: MultifilesService,  public dialog: MatDialog, public alertService: AlertService
    ) { }

    ngOnInit() {

        this.documentGrp = this.formBuilder.group({
            doc_name: '',
            doc_description: '',
            documentFile: new FormControl(File),
            items: this.formBuilder.array([this.createUploadDocuments()])
        });
    }

    createUploadDocuments(): FormGroup {
        return this.formBuilder.group({
            doc_name: '',
            doc_description: '',
            documentFile: File
        });
    }

    get items(): FormArray {
        return this.documentGrp.get('items') as FormArray;
    };

    addItem(): void {
        if (this.totalfiles.length !== 0) {
            if (this.items.value[0].doc_name !== '' &&
                this.items.value[0].doc_description !== '' && ((this.lengthCheckToaddMore) === (this.totalfiles.length))) {

                this.items.insert(0, this.createUploadDocuments())
                this.lengthCheckToaddMore = this.lengthCheckToaddMore + 1;
            }
        }
    }
    removeItem(index: number) {

        this.totalfiles.splice(index);
        this.totalFileName.splice(index);
        this.items.removeAt(index);
        this.lengthCheckToaddMore = this.lengthCheckToaddMore - 1;

    }

    public fileSelectionEvent(fileInput: any, oldIndex) {
        if (fileInput.target.files && fileInput.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
            }
            if (oldIndex === 0) {
                this.totalfiles.unshift((fileInput.target.files[0]))
                this.totalFileName.unshift(fileInput.target.files[0].name)
            } else {
                this.totalfiles[oldIndex] = (fileInput.target.files[0]);
                this.totalFileName[oldIndex] = fileInput.target.files[0].name
            }

            reader.readAsDataURL(fileInput.target.files[0]);
        }
        if (this.totalfiles.length === 1) {
            this.lengthCheckToaddMore = 1;
        }

    }

    public OnSubmit(formValue: any) {
        const main_form: FormData = new FormData();
        for (let j = 0; j < this.totalfiles.length; j++) {
          console.log('the values is ', <File>this.totalfiles[j]);
          console.log('the name is ', this.totalFileName[j]);
          main_form.append('files', <File>this.totalfiles[j])
        }
        // reverseFileNames=this.totalFileName.reverse();
        const AllFilesObj = []
        formValue.items.forEach((element, index) => {
          console.log('index is ', index);
          console.log('element is ', element);
          const eachObj = {
            'docname' : element.doc_name,
            'docdescription' : element.doc_description,
            'filename' : this.totalFileName[index]
          }
          AllFilesObj.push(eachObj);
        });
        // console.log('the Array data is ', JSON.stringify(AllFilesObj));
        main_form.append('fileInfo', JSON.stringify(AllFilesObj))
        this.multifilesService.saveFiles(main_form).subscribe(() => {
            this.alertService.success('Documents Saved successfully')
            const d =  this.dialog.open( AlertComponent, {
                  width: '650px',
              });
            d.afterClosed().subscribe(closed => {
              if (closed) {
                this.alertService.clear();
                this.documentGrp.reset();
              }
            })
        })
      }

    onFileTypeSelectionChanged(fileInput: any, index) {
        if (this.totalfiles.length !== 0) {
            const t = this.totalfiles[index].type;
            if (!t.includes(fileInput)) {
                // this.totalfiles.splice(index);
                // this.totalFileName.splice(index);

            }
        }
        this.changeFilter(fileInput);
    }

    changeFilter(fileInput: any) {
        if (this.imageFilter.includes(fileInput)) {
            console.log('image')
            this.fileFilter = this.imageFilter;
            return;
        }
        if (this.videoFilters.includes(fileInput)) {
            console.log('video')
            this.fileFilter = this.videoFilters;
            return;
        }
        if (this.soundFilter.includes(fileInput)) {
            console.log('sound')
            this.fileFilter = this.soundFilter;
        }
    }

}
