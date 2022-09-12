export class FileUpload {
    static filename(req, file, callback) {
        let originalFilename: string = file.originalname;
        let normalizedFilename: string = originalFilename.replace(/\s/g, '-');
        
        console.log(originalFilename);
        console.log(normalizedFilename);

        let date = new Date();

        let dateFileName = '';
        dateFileName += date.getFullYear().toString();
        dateFileName += (date.getMonth() + 1).toString();
        dateFileName += date.getDate().toString();

        let randomFileName: string = Math.random().toFixed(10).split('.')[1];

        const fullFileName: string = dateFileName + '-' + randomFileName + '-' + normalizedFilename;
        
        callback(null, fullFileName);
    }

    static fileFilter(req, file, callback) {
        if (!file.originalname.toLowerCase().match(/\.(jpg|png)$/)) {
            req.fileFilterError = 'Bad file extension';
            callback(null, false);
            return;
        }

        if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
            req.fileFilterError = 'Bad mimetype';
            callback(null, false);
            return;
        }

        callback(null, true);
    }
}