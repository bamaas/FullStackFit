import os
from app import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))        # Bind to env variable PORT if defined, otherwise default to 5000.
    debug=os.environ.get('DEBUG', False)
    if debug == 'True':
        debug = True
    else:
        debug = False
    print('Port is:', port)
    print('Debug is:', debug)
    app.run(debug=debug, host='0.0.0.0', port=port)      # The defbug=fTrue causes the application to restart on changes
