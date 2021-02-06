package app.entry;

import org.springframework.data.jpa.domain.Specification;

public class EntrySpecifications {

    public static Specification<Entry> isUser(String userId){
        return (entry, query, criteriaBuilder) -> {
            return criteriaBuilder.equal(entry.get("userId"), userId);
        };
    }

}
