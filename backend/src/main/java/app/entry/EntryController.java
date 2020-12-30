package app.entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin
@RestController
public class EntryController {

    @Autowired
    private EntryService entryService;

    @GetMapping("/entry/{id}")
    public Entry getEntry(@PathVariable long id){
        return entryService.getEntry(id);
    }

    @PreAuthorize("#entry.userId == principal.name")
    @PostMapping("/entry")
    public Entry addEntry(@RequestBody Entry entry) {
        return entryService.addEntry(entry);
    }

    @DeleteMapping("/entry/{id}")
    public void deleteEntry(@PathVariable long id){
        entryService.deleteEntry(id);
    }

    @PreAuthorize("#entry.userId == principal.name")
    @PutMapping("/entry")
    public Entry putEntry(@RequestBody Entry entry){
        return entryService.updateEntry(entry);
    }

    @GetMapping("/entry/page")
    public List<Entry> getAllEntries(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "30") Integer pageSize,
            @RequestParam(defaultValue = "date") String sortBy
    ){
        return entryService.getEntriesPage(pageNumber, pageSize, sortBy);
    }

}
