import { Component, Input } from '@angular/core';
import { NavController, ViewController, ModalController, AlertController, NavParams, Content } from 'ionic-angular';
import { ViewProductPage } from '../../pages/view-product/view-product';
import { CommentProvider } from '../../providers/comment/comment';
import { HomePage } from '../../pages/home/home';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'comment-component',
  templateUrl: 'comment-component.html'
})
export class CommentComponent {
  @Input() comments: any = {};
  @Input() user: any;
  @Input() product: any;
  @Input() allComments: any ={};
  @Input() profilePic: any ={};

  text: string;
  delete: boolean = true;
  comment: any;
  edited: boolean = false;
  view: boolean = false;
  shownGroup = null;
  filteredComments: any ={};
  replies: any =[];
  reply: any ={product_id : 0};
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private viewCtrl: ViewController, public commentProvider: CommentProvider,public userProvider: UserProvider, public modalCtrl: ModalController, public navParams: NavParams) {

  }

  deleteComment(comment) {
    const confirm = this.alertCtrl.create({
      title: 'Do you want to delete this comment?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.commentProvider.deleteComment(comment).subscribe((result) => {
              this.allComments.forEach(element => {
                if (element.parent_id == comment.id)
                this.commentProvider.deleteComment(element).subscribe((result) => {});
              });
              let alert = this.alertCtrl.create({
                title: 'Success',
                message: 'The comment was successfully deleted',
                buttons: ['Dismiss']
              });
              alert.present();
            });
            this.navCtrl.pop();
            console.log('Yes');
          }
        }
      ]
    });
    confirm.present();
  }

  getReplies(comment){
    this.replies = this.allComments.filter(data => ( data.parent_id == comment.id ));
  }
  // getPicture() {
  //   this.userProvider.getPicture(this.user.id)
  //     .subscribe(data => {
  //       this.comment.profile_image = data[0];
  //       console.log(this.profilePic);
  //     });
  // }
  updateComment(comment) {
    const prompt = this.alertCtrl.create({
      title: 'Update comment',
      inputs: [
        {
          type: 'textarea',
          name: 'content',
          placeholder: 'Edit your comment',
          value: comment.content
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel');
          }
        },
        {
          text: 'Save',
          handler: data => {
            comment.edited = true;
            comment.content = data.content;
            this.commentProvider.updateComment(comment).subscribe((result) => {
              this.comment= result;
              comment.updated = this.comment.updated;
            }, (err) => {
              console.log(err);
            });
          }
        }
      ]
    });
    prompt.present();
  }
  addReply(comment){
    
    const prompt = this.alertCtrl.create({
      title: 'Reply to this comment',
      inputs: [
        {
          type: 'textarea',
          name: 'content',
          placeholder: 'Reply',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.reply.content = data.content
            this.reply.product_id = this.product.id;
            this.reply.parent_id=comment.id;
            this.reply.profile_image=this.profilePic.image;
            this.commentProvider.createComment(this.reply).subscribe((result) => {
            this.allComments.push(result);
            }, (err) => {
              console.log(err);
            });
          }
        }
      ]
    });
    prompt.present();
  }
  
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    return this.shownGroup === group;
  };

}


