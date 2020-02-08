## Description
Docker image containing the backend for the [FullstackFit project](https://github.com/bamaas/FullStackFit)

This includes an API, based on Python's [FastAPI framework](https://fastapi.tiangolo.com/), to calculate things like the Body Mass Index, Basal Metabolic Rate, Total Daily Energy Expenditure and so on.

## Run command
The Docker command below starts the application and binds port 80 (host) to 5000 of the application.

```docker run --rm -d -p 80:5000 bamaas/fullstackfit-backend-python-fastapi```

Now go to ```http://localhost:80/docs``` to see the application documentation page.

### Custom Port
To startup the application on another port you can give the environment variable "PORT" through the run command. For example:

```docker run --rm -d -e PORT=3000 -p 80:3000 bamaas/fullstackfit-backend-python-fastapi```

Will run the backend in the container on port 3000. Don't forget to bind the host to port 3000 in this case.