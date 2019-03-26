import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news-grid-list',
  templateUrl: './news-grid-list.component.html',
  styleUrls: ['./news-grid-list.component.css']
})
export class NewsGridListComponent implements OnInit {

  newsArticles = [
    {
      id: '12345657890987654321',
      sourceImage: 'http://www.nytimes.com/services/mobile/img/android-newsreader-icon.png',
      author: 'SARA BONISTEEL',
      content: 'The use of custard powder an instant custard mix, which was a pantry staple of the empire, devised for those with egg allergies gave their new dainty its distinctive yellow belt Around the same time, bakers in Canadas prairie provinces were serving up a sim… [+1067 chars]',
      publishedAt: new Date('2019-03-22T16:33:58Z'),
      title: 'Wait, How Did You Get Into Collee?1',
      source: { id: 'the-new-york-times', name: 'The New York Times' },
      description: 'How first-generation stud ents learn about the  myth of meritocracy.',
      urlToImage: 'https://static01.nyt.com/images/2019/03/17/opinion/sunday/17capocrucet/17capocrucet-facebookJumbo.jpg',
      url: 'https://www.nytimes.com/2019/03/16/opinion/sunday/college-admissions-merit.html',
      numLikes: 1,
      hasLiked: false,
      comments: ['Comment One', 'Comment Two', 'Comment Three'],
      isStared: false,
  },
  {
    id: '12345657890987654321',
    sourceImage: 'http://www.nytimes.com/services/mobile/img/android-newsreader-icon.png',
    author: 'SARA BONISTEEL',
    content: 'The use of custard powder an instant custard mix, which was a pantry staple of the empire, devised for those with egg allergies gave their new dainty its distinctive yellow belt Around the same time, bakers in Canadas prairie provinces were serving up a sim… [+1067 chars]',
    publishedAt: new Date('2019-03-22T16:33:58Z'),
    title: 'Wait, How Did You Get Into Collee?2',
    source: { id: 'the-new-york-times', name: 'The New York Times' },
    description: 'How first-generation stud ents learn about the  myth of meritocracy.',
    urlToImage: 'https://static01.nyt.com/images/2019/03/17/opinion/sunday/17capocrucet/17capocrucet-facebookJumbo.jpg',
    url: 'https://www.nytimes.com/2019/03/16/opinion/sunday/college-admissions-merit.html',
    numLikes: 1,
    hasLiked: false,
    comments: ['Comment One', 'Comment Two', 'Comment Three'],
    isStared: false,
},


  ]

  constructor() { }

  ngOnInit() {
  }

}
