import { Component, OnInit, Renderer } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MultifilesService } from 'app/services/multifiles.service';



@Component({
    selector: 'app-image-item-form',
    templateUrl: './image-item-form.component.html',
    styleUrls: ['./image-item-form.component.css'],
})
export class ImageComponent implements OnInit {
    public documentGrp: FormGroup;
    public totalfiles: Array<File> = [];
    public totalFileName = [];
    public lengthCheckToaddMore = 0;
    constructor(private formBuilder: FormBuilder,
        private multifilesService: MultifilesService
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

            main_form.append(this.totalFileName[j], <File>this.totalfiles[j])
        }
        console.log(formValue.items)
        const AllFilesObj = []
        formValue.items.forEach((element, index) => {
            console.log('index is ', index);
            console.log('element is ', element);
            const eachObj = {
                'doc_name': element.doc_name,
                'doc_description': element.doc_description,
                'file_name': this.totalFileName[index]
            }
            AllFilesObj.push(eachObj);
        });
        main_form.append('fileInfo', JSON.stringify(AllFilesObj))
        this.multifilesService.saveFiles(main_form).subscribe(() => {
        })
    }

}
