"""
fetch_hmd.py — Download and generate mortality_data.json from the Human Mortality Database.

Usage:
    python data/fetch_hmd.py --username YOUR_HMD_USERNAME

    Password is read from the HMD_PASSWORD environment variable to avoid
    exposing credentials in shell history or process listings:

        export HMD_PASSWORD=your_password
        python data/fetch_hmd.py --username your_username

Requires a free HMD account: https://www.mortality.org
"""

import argparse
import io
import json
import os
import zipfile
from pathlib import Path

import requests

HMD_LOGIN   = "https://www.mortality.org/Account/Login"
HMD_LT_BOTH = "https://www.mortality.org/File/GetDocument/hmd.v6/zip/by_statistic/lt_both.zip"

COUNTRIES = {
    "NOR": "Norway",
    "SWE": "Sweden",
    "DNK": "Denmark",
    "FIN": "Finland",
    "DEUTNP": "Germany",    # HMD code for Deutschland total
    "FRATNP": "France",
    "GBR_NP": "United Kingdom",
    "USA": "United States",
    "JPN": "Japan",
    "NLD": "Netherlands",
    "ITA": "Italy",
    "ESP": "Spain",
    "AUS": "Australia",
    "CAN": "Canada",
}

# Oversett HMD-koder til våre korte koder
HMD_TO_LOCAL = {
    "NOR": "NOR", "SWE": "SWE", "DNK": "DNK", "FIN": "FIN",
    "DEUTNP": "DEU", "FRATNP": "FRA", "GBR_NP": "GBR",
    "USA": "USA", "JPN": "JPN", "NLD": "NLD",
    "ITA": "ITA", "ESP": "ESP", "AUS": "AUS", "CAN": "CAN",
}


def fetch_hmd_qx(username: str, password: str) -> dict:
    session = requests.Session()
    resp = session.post(HMD_LOGIN, data={"username": username, "password": password})
    resp.raise_for_status()

    r = session.get(HMD_LT_BOTH)
    r.raise_for_status()

    z = zipfile.ZipFile(io.BytesIO(r.content))
    result = {}

    for hmd_code, local_code in HMD_TO_LOCAL.items():
        # Filnavn i zip: bltper_1x1/NOR.bltper_1x1.txt
        fname = f"bltper_1x1/{hmd_code}.bltper_1x1.txt"
        if fname not in z.namelist():
            print(f"  Not found: {fname}")
            continue

        lines = z.read(fname).decode("utf-8").splitlines()
        # Finn siste år i datasettet
        data_lines = [l for l in lines if l.strip() and not l.startswith("Year")]
        if not data_lines:
            continue

        years = sorted(set(int(l.split()[0]) for l in data_lines if l.split()[0].isdigit()))
        last_year = max(years)

        qx = {}
        e0 = None
        for line in data_lines:
            parts = line.split()
            if len(parts) < 6 or not parts[0].isdigit():
                continue
            year = int(parts[0])
            if year != last_year:
                continue
            age_raw = parts[1]
            age = 110 if age_raw == "110+" else int(age_raw)
            if age > 105:
                continue
            qx_val = float(parts[4])  # qx er kolonne 5 (0-indeksert: 4)
            qx[str(age)] = qx_val
            if age == 0:
                e0 = float(parts[9])  # ex er siste kolonne

        result[local_code] = {
            "name": COUNTRIES[hmd_code],
            "e0": round(e0, 1) if e0 else None,
            "qx": qx,
        }
        print(f"  {local_code}: {last_year}, e0={e0:.1f}")

    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--username", required=True)
    parser.add_argument("--out", default="public/data/mortality_data.json")
    args = parser.parse_args()

    password = os.environ.get("HMD_PASSWORD")
    if not password:
        parser.error("HMD_PASSWORD environment variable is not set")

    print("Connecting to HMD…")
    data = fetch_hmd_qx(args.username, password)

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(data, f, separators=(",", ":"))

    print(f"Wrote {len(data)} countries to {out_path}")


if __name__ == "__main__":
    main()
