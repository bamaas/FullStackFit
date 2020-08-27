package app.log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
public class LogController {

    @Autowired
    private LogService logService;

//    @GetMapping("/log")
//    public List<Log> getAll(){
//        return logService.getAllLogEntries();
//    }

    @GetMapping("/log/{id}")
    public Log getLog(@PathVariable long id){
        return logService.getLog(id);
    }

    @PostMapping("/log")
    public Log addLog(@RequestBody Log log) {
        return logService.addLog(log);
    }

    @DeleteMapping("/log/{id}")
    public void deleteLog(@PathVariable long id){
        logService.deleteLog(id);
    }

    @PutMapping("/log")
    public Log putLog(@RequestBody Log log){
        return logService.putLog(log);
    }

    @GetMapping("/log")
    public List<Log> getAllEntries(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "30") Integer pageSize,
            @RequestParam(defaultValue = "date") String sortBy
    ){
        return logService.getAllEntries(pageNumber, pageSize, sortBy);
    }
}
