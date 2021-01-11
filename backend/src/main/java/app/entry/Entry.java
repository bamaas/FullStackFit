package app.entry;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.Map;

@Getter
@Setter
@Entity(name="entry")
@Table(name="entry")
@JsonSerialize(using = EntrySerializer.class)
public class Entry {

    public Entry() {

    }

    public Entry(long id, float weight, Date date, String note) {
        super();
        this.id = id;
        this.weight = weight;
        this.date = date;
        this.note = note;
    }

    @Override
    public String toString() {
        return "id: " + getId() +
                " | Weight: " + getWeight() +
                " | Date: " + getDate() +
                " | Note: " + getNote();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "weight", nullable = false)
    private float weight;

    @Column(name = "note")
    private String note;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @Column(name = "date", unique = true, nullable = false)
    private Date date;

    @Column(name="year")
    private Short year;

    @Column(name="week")
    private Short week;

    @Column(name = "circ_chest")
    private Short circumferenceChest;

    @Column(name = "circ_arm")
    private Short circumferenceArm;

    @Column(name = "circ_leg")
    private Short circumferenceLeg;

    @Column(name = "circ_calf")
    private Short circumferenceCalf;

    @Column(name = "circ_waist")
    private Short circumferenceWaist;

    @Column(name = "circ_neck")
    private Short circumferenceNeck;

    @Column(name = "skinfold_chest")
    private Short skinfoldChest;

    @Column(name = "skinfold_abdominal")
    private Short skinfoldAbdominal;

    @Column(name = "skinfold_biceps")
    private Short skinfoldBiceps;

    @Column(name = "skinfold_triceps")
    private Short skinfoldTriceps;

    @Column(name = "skinfold_thigh")
    private Short skinfoldThigh;

    @Column(name = "skinfold_calf")
    private Short skinfoldCalf;


    @JsonProperty("circumference")
    private void unpackNestedCircumference(Map<String, Short> circumference) {
        this.circumferenceChest = circumference.get("chest");
        this.circumferenceArm = circumference.get("arm");
        this.circumferenceLeg = circumference.get("leg");
        this.circumferenceCalf = circumference.get("calf");
        this.circumferenceNeck = circumference.get("neck");
        this.circumferenceWaist = circumference.get("waist");
    }

    @JsonProperty("skinfold")
    private void unpackNestedSkinfold(Map<String, Short> skinfold) {
        this.skinfoldChest = skinfold.get("chest");
        this.skinfoldBiceps = skinfold.get("biceps");
        this.skinfoldTriceps = skinfold.get("triceps");
        this.skinfoldCalf = skinfold.get("calf");
        this.skinfoldThigh = skinfold.get("thigh");
        this.skinfoldAbdominal = skinfold.get("abdominal");
    }

}
