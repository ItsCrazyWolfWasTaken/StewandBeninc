import { zip } from "./3rdparty/zip.js"
import * as Events from "./events.js"

var errorHandler = null;

// Disable use of web workers for zip files
zip.useWebWorkers = false;

function unzip(file, success, failure) {
  failure = failure || errorHandler;

  function entryProcessor(entries) {
    var romEntry = null;
    var a78 = false;
    if (entries.length == 1) {
      romEntry = entries[0];
    } else if (entries.length > 0) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var filename = entry.filename.toLowerCase();
        if (filename.endsWith("p.a78")) {
          // Hack to work around PAL homebrew
          // TODO: Use header instead of file name
          romEntry = entry;
          a78 = true;
        } else if (filename.endsWith(".a78")) {
          romEntry = entry;
          break;
        } else if (filename.endsWith(".bin") && !a78) {
          romEntry = entry;
        }
      }
    }
    if (romEntry) {
      var writer = new zip.BlobWriter();
      romEntry.getData(writer, success);
    } else {
      failure("Unable to find valid ROM in zip file");
    }
  }

  function blobReader(zipReader) {
    zipReader.getEntries(
      entryProcessor,
      failure
    );
  }

  zip.createReader(
    new zip.BlobReader(file),
    blobReader,
    function () { success(file); } // Assume is not a zip file
  );
}

Events.addListener(new Events.Listener("siteInit", function (event) {
  errorHandler = event.errorHandler;
}));

export { unzip }