package com.triforge.engine.match;

/** Mutable per-player scoreboard accumulator for one match (room thread only). */
public final class MatchStats {
    private int kills;
    private int deaths;
    private int assists;
    private int damageDealt;
    private int damageTaken;
    private int shotsFired;
    private int shotsHit;

    public void addKill() {
        kills++;
    }

    public void addDeath() {
        deaths++;
    }

    public void addAssist() {
        assists++;
    }

    public void addDamageDealt(int amount) {
        damageDealt += Math.max(0, amount);
    }

    public void addDamageTaken(int amount) {
        damageTaken += Math.max(0, amount);
    }

    public void recordShotFired() {
        shotsFired++;
    }

    public void recordShotHit() {
        shotsHit++;
    }

    public int kills() {
        return kills;
    }

    public int deaths() {
        return deaths;
    }

    public int assists() {
        return assists;
    }

    public int damageDealt() {
        return damageDealt;
    }

    public int damageTaken() {
        return damageTaken;
    }

    public int shotsFired() {
        return shotsFired;
    }

    public int shotsHit() {
        return shotsHit;
    }

    public double accuracy() {
        return shotsFired == 0 ? 0.0 : (double) shotsHit / shotsFired;
    }

    public void reset() {
        kills = 0;
        deaths = 0;
        assists = 0;
        damageDealt = 0;
        damageTaken = 0;
        shotsFired = 0;
        shotsHit = 0;
    }
}
