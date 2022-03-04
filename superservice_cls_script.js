const express = require('express'),
  app = express(),
  fs = require('fs'),
  shell = require('shelljs'),  
  mainFolderPath = './Responses/SuperService/Cls/',  // Modify the folder path in which responses need to be stored
  defaultFileExtension = 'xml', // Change the default file extension
  bodyParser = require('body-parser'),
  DEFAULT_MODE = 'writeFile',
  path = require('path');
  
require('body-parser-xml')(bodyParser);

// Create the folder path in case it doesn't exist
shell.mkdir('-p', getFolderPath());

 // Change the limits according to your response size
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 

app.get('/', (req, res) => res.send('Hello, I write data to file. Send them requests!'));

app.get('/folderName', (req, res) => res.send(getFolderPath()));

app.post('/write', (req, res) => {
  let extension = req.body.fileExtension || defaultFileExtension,
    fsMode = req.body.mode || DEFAULT_MODE,
    uniqueIdentifier = req.body.uniqueIdentifier ? typeof req.body.uniqueIdentifier === 'boolean' ? Date.now() : req.body.uniqueIdentifier : false,
    filename = `${req.body.requestName}${uniqueIdentifier || ''}`,
    filePath = `${path.join(getFolderPath(), filename)}.${extension}`,
    options = req.body.options || undefined;

  fs[fsMode](filePath, req.body.responseData, options, (err) => {
    if (err) {
      console.log(err);
      res.send('Error');
    }
    else {
      res.send('Success');
    }
  });
});


app.listen(3000, () => {
  console.log('ResponsesToFile App is listening now! Send them requests my way!');
  console.log(`Data is being stored at location: ${path.join(process.cwd(), mainFolderPath)}`);
});

function getFolderPath()
{
  var nowDate = new Date();

  var yyyy = nowDate.getFullYear();
  var mm = nowDate.getMonth() + 1; // Months start at 0!
  var dd = nowDate.getDate();
  
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  
  var dateNamePart = dd + '-' + mm + '-' + yyyy;

  return mainFolderPath + dateNamePart + '/'; 
}