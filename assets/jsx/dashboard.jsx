var React = require('react/addons'),
    filesize = require('filesize');

class Dashboard extends React.Component {
    getProgressBarClasses(workerStats) {
        var res = ['progress-bar'];

        if (workerStats.completed) {
            res.push('progress-bar-success');
        } else if (workerStats.active > 0) {
            res = res.concat(['progress-bar-striped', 'active']);
        }

        return res.join(' ');
    }

    render() {
        var files = this.props.files,
            hashWorkers = this.props.hashWorkers,
            uploadWorkers = this.props.uploadWorkers;

        if (files.total < 1) {
            return null;
        }

        var hashComplete = (100 * (1 - (hashWorkers.pendingFiles / files.total))).toFixed(0),
            hashBytesPerSecond = hashWorkers.totalBytes / hashWorkers.totalTime || 0,
            hashSpeed = filesize(hashBytesPerSecond, {round: 1});

        var uploadComplete = (100 * (files.bytesUploaded / hashWorkers.totalBytes)).toFixed(0),
            uploadCompleteStyle = {width: uploadComplete + '%'},
            uploadBytesPerSecond = uploadWorkers.totalBytes / uploadWorkers.totalTime || 0,
            uploadSpeed = filesize(uploadBytesPerSecond, {round: 1}),
            prettyBytesUploaded = filesize(files.bytesUploaded, {round: 0});

        var hashProgressClasses = this.getProgressBarClasses(hashWorkers),
            uploadProgressClasses = this.getProgressBarClasses(uploadWorkers);

        return (
            <div className="dashboard well well-sm clearfix">
                <div className="col-sm-6 hash-stats">
                    <h5>Hashing</h5>
                    <div className="progress">
                        <div className={hashProgressClasses} role="progressbar" aria-valuenow={{width: hashComplete + '%'}} aria-valuemin="0" aria-valuemax="100" style={{width: hashComplete + '%'}}>
                            {hashComplete}%
                        </div>
                    </div>

                    <p>{hashWorkers.active} / {hashWorkers.total} active, average throughput: {hashSpeed}/s</p>
                </div>
                <div className="col-sm-6 upload-stats">
                    <h5>Uploads</h5>

                    <div className="progress">
                        <div className={uploadProgressClasses} role="progressbar" aria-valuenow="{uploadComplete}" aria-valuemin="0" aria-valuemax="100" style={uploadCompleteStyle}>
                            {uploadComplete}%
                        </div>
                    </div>

                    <p>Completed: <code>{prettyBytesUploaded}</code>. Effective upload speed: <code>{uploadSpeed}</code>/s</p>
                </div>
            </div>
        );
    }
}

export { Dashboard };
