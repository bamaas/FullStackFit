package app.entry;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import javax.persistence.*;
import java.util.Date;
import java.util.Map;

@Entity(name="entry")
@Table(name="entry")
@JsonSerialize(using = EntrySerializer.class)
public class Entry {

    public Entry(){

    }

    public Entry(long id, float weight, Date date, String note) {
        super();
        this.id = id;
        this.weight = weight;
        this.date = date;
        this.note = note;
    }

    @Override
    public String toString(){
        return "id: " + getId()+
                " | Weight: " + getWeight() +
                " | Date: " + getDate()  +
                " | Note: " + getNote();
    }

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="id",unique=true,nullable=false)
    private long id;

    @Column(name="user_id", nullable = false)
    private String userId;

    @Column(name="weight", nullable = false)
    private float weight;

    @Column(name="note")
    private String note;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm")
    @Column(name="date", unique = true, nullable = false)
    private Date date;

    @Column(name="circ_chest")
    private Short circumferenceChest;

    @Column(name="circ_arm")
    private Short circumferenceArm;

    @Column(name="circ_leg")
    private Short circumferenceLeg;

    @Column(name="circ_calf")
    private Short circumferenceCalf;

    @Column(name="circ_waist")
    private Short circumferenceWaist;

    @Column(name="circ_neck")
    private Short circumferenceNeck;

    @Column(name="skinfold_chest")
    private Short skinfoldChest;

    @Column(name="skinfold_abdominal")
    private Short skinfoldAbdominal;

    @Column(name="skinfold_biceps")
    private Short skinfoldBiceps;

    @Column(name="skinfold_triceps")
    private Short skinfoldTriceps;

        @Column(name="skinfold_thigh")
    private Short skinfoldThigh;

    @Column(name="skinfold_calf")
    private Short skinfoldCalf;


    @JsonProperty("circumference")
    private void unpackNestedCircumference(Map<String,Short> circumference) {
        this.circumferenceChest = circumference.get("chest");
        this.circumferenceArm = circumference.get("arm");
        this.circumferenceLeg = circumference.get("leg");
        this.circumferenceCalf = circumference.get("calf");
        this.circumferenceNeck = circumference.get("neck");
        this.circumferenceWaist = circumference.get("waist");
    }

    @JsonProperty("skinfold")
    private void unpackNestedSkinfold(Map<String,Short> skinfold) {
        this.skinfoldChest = skinfold.get("chest");
        this.skinfoldBiceps = skinfold.get("biceps");
        this.skinfoldTriceps = skinfold.get("triceps");
        this.skinfoldCalf = skinfold.get("calf");
        this.skinfoldThigh = skinfold.get("thigh");
        this.skinfoldAbdominal = skinfold.get("abdominal");
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public float getWeight() {
        return this.weight;
    }

    public void setWeight(float weight) {
        this.weight = weight;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setUserId(String id) { this.userId = id; }

    public String getUserId() { return this.userId; }

    public Short getCircumferenceChest() {
        return circumferenceChest;
    }

    public void setCircumferenceChest(Short circumferenceChest) {
        this.circumferenceChest = circumferenceChest;
    }

    public Short getCircumferenceArm() {
        return circumferenceArm;
    }

    public void setCircumferenceArm(Short circumferenceArm) {
        this.circumferenceArm = circumferenceArm;
    }

    public Short getCircumferenceLeg() {
        return circumferenceLeg;
    }

    public void setCircumferenceLeg(Short circumferenceLeg) {
        this.circumferenceLeg = circumferenceLeg;
    }

    public Short getCircumferenceCalf() {
        return circumferenceCalf;
    }

    public void setCircumferenceCalf(Short circumferenceCalf) {
        this.circumferenceCalf = circumferenceCalf;
    }

    public Short getCircumferenceWaist() {
        return circumferenceWaist;
    }

    public void setCircumferenceWaist(Short circumferenceWaist) {
        this.circumferenceWaist = circumferenceWaist;
    }

    public Short getCircumferenceNeck() {
        return circumferenceNeck;
    }

    public void setCircumferenceNeck(Short circumferenceNeck) {
        this.circumferenceNeck = circumferenceNeck;
    }

    public Short getSkinfoldChest() {
        return skinfoldChest;
    }

    public void setSkinfoldChest(Short skinfoldChest) {
        this.skinfoldChest = skinfoldChest;
    }

    public Short getSkinfoldAbdominal() {
        return skinfoldAbdominal;
    }

    public void setSkinfoldAbdominal(Short skinfoldAbdominal) {
        this.skinfoldAbdominal = skinfoldAbdominal;
    }

    public Short getSkinfoldBiceps() {
        return skinfoldBiceps;
    }

    public void setSkinfoldBiceps(Short skinfoldBiceps) {
        this.skinfoldBiceps = skinfoldBiceps;
    }

    public Short getSkinfoldTriceps() {
        return skinfoldTriceps;
    }

    public void setSkinfoldTriceps(Short skinfoldTriceps) {
        this.skinfoldTriceps = skinfoldTriceps;
    }

    public Short getSkinfoldThigh() {
        return skinfoldThigh;
    }

    public void setSkinfoldThigh(Short skinfoldThigh) {
        this.skinfoldThigh = skinfoldThigh;
    }

    public Short getSkinfoldCalf() {
        return skinfoldCalf;
    }

    public void setSkinfoldCalf(Short skinfoldCalf) {
        this.skinfoldCalf = skinfoldCalf;
    }
}
