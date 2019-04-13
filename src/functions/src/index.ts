import * as functions from 'firebase-functions';
import * as  admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();


exports.aggregateInterestedArticles = functions.firestore
    .document('userInteracted/{uidnewsid}')
    .onWrite((snap, context) => {
        const afterData = snap.after.data();
        if (!afterData) {
            console.log("there is no after data");
            return;
        }

        //reference to the aggregate documnet 
        const docRef = admin.firestore().collection('userAggregate').doc(afterData.uid);

        return admin.firestore().collection('userInteracted')
            .where('uid', '==', afterData.uid)
            .orderBy('updatedAt', 'desc')
            .limit(100)
            .get()
            .then(querySnapshot => {

                const articlesCount = querySnapshot.size

                const staredArticles: any = []
                const likedArticles: any = []

                //hold the promises 
                let docps: any = [];

                querySnapshot.forEach(doc => {
                    //console.log('doc', doc.data());
                    const tags: string[] = doc.data().tags;

                    const article = admin.firestore().doc(`news/${doc.data().news_id}`)
                    docps.push(article.get()
                        .then(qs => {
                            //console.log('articles data', qs.data());
                            if (tags.indexOf("stared") >= 0)
                                staredArticles.push(qs.data());
                            else if (tags.indexOf("liked") >= 0)
                                likedArticles.push(qs.data());

                        }).catch(err => console.log(err)));
                });

                Promise.all(docps).then(() => {
                    // data to update on the document
                    const data = { articlesCount, staredArticles, likedArticles }
                    console.log("setting data", data)
                    // run update
                    return docRef.set(data)
                }).catch(err => console.log(err))

            })
            .catch(err => console.log(err))
    });




exports.countLikes = functions.firestore
    .document('userInteracted/{uidnewsid}')
    .onWrite((snap, context) => {
        const afterData = snap.after.data();
        if (!afterData) {
            console.log("there is no after data");
            return;
        }

        //reference to the aggregate documnet 
        const docRef = admin.firestore().collection('news').doc(afterData.news_id);

        return admin.firestore().collection('userInteracted')
            .where('news_id', '==', afterData.news_id)
            .where('tags', 'array-contains', 'liked')
            .get()
            .then(querySnapshot => {
                const likesCount = querySnapshot.size;
                console.log("updateing likes to", likesCount);
                return docRef.update({ numLikes: likesCount })
            }).catch(err => console.log(err));
    })
