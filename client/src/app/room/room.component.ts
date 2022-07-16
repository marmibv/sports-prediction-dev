import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { Room } from '../room';
import { Tournament } from '../tournament';
import { RoomService } from '../room.service';
import { DataService } from '../data.service';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  public roomUsers: User[] = [];
  public roomName: string = "";
  public room = new Room();
  public faTrophy = faTrophy;
  public active: number = 1;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.onRoomRequest();
  };

  async onRoomRequest(){
    const roomID: string = this.route.snapshot.paramMap.get("id")!;
    const rooms: Array<Room> = await this.roomService.getRoom(roomID);
    this.room = rooms[0];
    
    const tournaments: Array<Tournament> = await this.dataService.getTournaments(this.room.tournament_id);
    this.room.tournament = tournaments[0].name;
    this.room.start_date = tournaments[0].start_date;
    this.room.end_date = tournaments[0].end_date;
    this.room.tournament_id = tournaments[0]._id;

    const now = new Date();
    const start_date = new Date(this.room.start_date);
    const end_date = new Date(this.room.end_date);

    if (now < start_date) {
      this.room.status = "W";
      let diffInMs: number = Math.abs(start_date.valueOf() - now.valueOf());
      let diff: number =  diffInMs / (1000 * 60 * 60 * 24);
      this.room.timeUntil = Math.ceil(diff);
    } else if (now < end_date) {
        this.room.status = "A";
    } else {
        this.room.status = "E";
    };
    
    this.roomUsers = await this.roomService.getRoomUsers([roomID]);
    const isThereAnyScore: Array<number> = this.roomUsers[0].tournaments.filter(function(trn):boolean{return trn.tournament_id === tournaments[0]._id})[0].scores;
    if(isThereAnyScore.length>0){
      const lastIndex: number = isThereAnyScore.length - 1;
      this.roomUsers.sort(
        (firsUser: User, secondUser: User) =>
          (firsUser.tournaments.filter(function(trn):boolean{return trn.tournament_id === tournaments[0]._id})[0].scores[lastIndex] > secondUser.tournaments.filter(function(trn):boolean{return trn.tournament_id === tournaments[0]._id})[0].scores[lastIndex]) ? -1 : 1);
    };
  };

  formatDate(dateString: string): string {
    const monthLookup: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                                  "October", "November", "December"];
    const date = new Date(dateString);
    return `${date.getDate()}. ${monthLookup[date.getMonth()]}`
  };

  findPoints(username: string): number {
    const trn_id: string = this.room.tournament_id;
    const usr: User = this.roomUsers.filter(function(user):boolean{return user.username == username})[0];
    const scores: Array<number> = usr.tournaments.filter(function(trn):boolean{return trn.tournament_id == trn_id})[0].scores;
    return scores[scores.length-1];
  };

}
