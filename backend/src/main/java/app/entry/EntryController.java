package app.entry;

import net.kaczmarzyk.spring.data.jpa.domain.Equal;
import net.kaczmarzyk.spring.data.jpa.web.annotation.And;
import net.kaczmarzyk.spring.data.jpa.web.annotation.Spec;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.ModelMap;
import org.springframework.util.MultiValueMap;
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

    @PostMapping("/entry")
    public Entry addEntry(@RequestBody Entry entry, Principal principal) {
        entry.setUserId(principal.getName());
        return entryService.addEntry(entry);
    }

    @DeleteMapping("/entry/{id}")
    public void deleteEntry(@PathVariable long id){
        entryService.deleteEntry(id);
    }

    @PutMapping("/entry")
    public Entry putEntry(@RequestBody Entry entry, Principal principal){
        entry.setUserId(principal.getName());
        return entryService.updateEntry(entry);
    }

    @GetMapping("/entry/search")
    public ResponseEntity<?> search(
            @And({
                    @Spec(path = "year", params = "year", defaultVal = "0", spec = Equal.class),
                    @Spec(path = "week", params = "week", defaultVal = "0", spec = Equal.class),
            })
                    Specification<Entry> requestParametersSpecification,
            @RequestHeader Map<String, String> headers,
            @RequestParam MultiValueMap<String, String> requestParameters,
            Principal principal
    ) {
        String userId = principal.getName();
        Specification<Entry> specification = EntrySpecifications.isUser(userId);
        if (requestParameters.size() > 0){
            specification = specification.and(requestParametersSpecification);
        }
        String pageNumber = headers.get("pagenumber");
        String pageSize = headers.get("pagesize");
        String sortBy = headers.get("sortby");
        pageNumber = pageNumber == null ? "0" : pageNumber;
        pageSize = pageSize == null ? "30" : pageSize;
        sortBy = sortBy == null ? "date" : sortBy;
        List<Entry> response = entryService.seachEntryPage(specification, Integer.parseInt(pageNumber), Integer.parseInt(pageSize), sortBy);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
