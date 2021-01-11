package app.entry;

import net.kaczmarzyk.spring.data.jpa.domain.Equal;
import net.kaczmarzyk.spring.data.jpa.web.annotation.And;
import net.kaczmarzyk.spring.data.jpa.web.annotation.Spec;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/entry/search")
    public ResponseEntity<?> search(
            @And({
                    @Spec(path = "year", params = "year", spec = Equal.class),
                    @Spec(path = "week", params = "week", spec = Equal.class),
            })
            Specification<Entry> specification,
            Sort sort,
            @RequestHeader Map<String, String> headers,
            Principal principal
    ) {
        if (!principal.getName().equals(headers.get("userid"))){
            return new ResponseEntity<String>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        List<Entry> response = entryService.search(specification, sort);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
