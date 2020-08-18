package app.log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    public List<Log> getAllLogEntries(){
        List<Log> entries = new ArrayList<>();
        logRepository.findAll().forEach(entries::add);
        return entries;
    }

    public Log getLog(Long id){
        return logRepository.findById(id).orElse(null);
    }

    public Map<String, String> addLog(Log log){
        Log entry = logRepository.save(log);
        return Map.of("id", String.valueOf(entry.getId()));
    }

    public void deleteLog(long id){
        logRepository.deleteById(id);
    }

    public void editLog(long id){
        System.out.println("editing log");
    }

    public void putLog(Log log){
        logRepository.save(log);
    }
}
