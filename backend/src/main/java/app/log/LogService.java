package app.log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
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
        DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss:SSS");
        return Map.of(
                "id", String.valueOf(entry.getId()),
                "timestamp", dateFormat.format(entry.getTimestamp())
        );
    }

    public void deleteLog(long id){
        logRepository.deleteById(id);
    }
}
