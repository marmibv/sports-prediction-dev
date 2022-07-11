import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Room } from './room';
import { lastValueFrom } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomUrl = "http://localhost:8080/api/rooms"

  constructor(
    private http: HttpClient
  ) { }

  async createNewRoom(room: Room): Promise<any> {
    return await lastValueFrom(this.http.post(`${this.roomUrl}/new`, room, httpOptions));
  }


  async findRoomByKey(room_key: string): Promise<any> {
    console.log(`${this.roomUrl}/${room_key}/joindata`)
    return await lastValueFrom(this.http.get(`${this.roomUrl}/${room_key}/joindata`, httpOptions));
  }


  async joinRoom(room_id: string): Promise<any> {
    return await lastValueFrom(this.http.post(`${this.roomUrl}/${room_id}/join`, httpOptions));
  }

  async getRooms(username: string):Promise<any> {
    return await lastValueFrom(this.http.get(`${this.roomUrl}/${username}/all`)); 
  };

  async getRoom(room_id: string):Promise<any> {
    return await lastValueFrom(this.http.get(`${this.roomUrl}/${room_id}/room`, httpOptions));
  };

  async getRoomUsers(roomID: Array<string>):Promise<any> {
    let params: HttpParams = new HttpParams().append('room', roomID.toString());
    let headers = httpOptions.headers;
    return await lastValueFrom(this.http.get(`${this.roomUrl}/members`, {headers, params}));
  };
}
